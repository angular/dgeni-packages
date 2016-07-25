# Dgeni Packages

Ce dépôt contient une collection de **Packages** de Dgeni qui peuvent être utilisés par Dgeni, le générateur
de documentation, pour créer une documentation à partir du code source.


Actuellement, il y a les packages suivants :

* base - L'ensemble minimal des processeurs pour commencer avec Dgeni
* git - Fournit plusieurs informations de git et des versions
* jsdoc - Extraction et analyse des balises
* nunjucks - Le moteur de rendu de template de nunjucks. Comme il n'est plus dans jsdoc, vous devez l'ajouter
  explicitement dans votre configuration ou vous obtiendrez l'erreur
  `Error: No provider for "templateEngine"! (Resolving: templateEngine)`
* ngdoc - La partie spécifique d'angular.js, avec la définition des balises, des processeurs et des templates.
  Celui-ci charge les packages de jsdoc et nunjucks pour vous.
* examples - Processeurs pour supporter les exemples exécutables qui figurent sur les docs du site d'angular.js.
* dgeni - support pour la documentation des packages de Dgeni (**incomplet**)
* typescript - analyse et extraction de balise des modules TypeScript.

## Le package `base`

### Processeurs

* `computeIdsProcessor` - Détermine le `id` et le `aliases` pour les documents en utilisant des templates ou des fonctions
d'aide, sur la base du `docType`.
* `computePathsProcessor` - Détermine le `path` et le `outputPath` des documents en utilisant des templates ou des fonctions
d'aide, sur la base du `docType`.
* `debugDumpProcessor` - extrait l'état courant du tableau docs dans un fichier (désactivé par défaut)
* `readFilesProcessor` - utilisé pour charger les documents depuis les fichiers. Ce processeur peut-être configuré pour utiliser
un ensemble de **lecteur de fichier**. Il y a des lecteurs de fichiers (file-readers) dans les packages `jsdoc` et `ngdoc`.
* `renderDocsProcessor` - rendre les documents dans une propriété (`doc.renderedContent`) en utilisant
un `templateEngine` (moteur de template), qui doit être fourni séparément - voir le package `nunjucks`.
* `unescapeCommentsProcessor` - reformatte les marqueurs de commentaires pour ne pas casser le style des commentaires de jsdoc,
par exemple `*/`
* `writeFilesProcessor` - écrit les docs (pour ceux ont un `outputPath`) sur le disque

### Services

* `aliasMap` - Un map de ids/aliases pour les docs. C'est utilisé pour faire correspondre les références aux documents dans
des liens et des relations tels que les modules et les membres de l'objet.
* `createDocMessage` - une aide pour créer de beaux messages à propos des documents (utile pour les logs et
les erreurs)
* `encodeDocBlock` - convertir un bloc de code en HTML
* `templateFinder` - recherche dans les répertoires à l'aide de modèle (pattern) pour trouver un template qui correspond au document donné.
* `trimIndentation` - coupe "intelligemment" l'indentation dès le début de chaque ligne d'un bloc
de texte.
* `writeFile` - écrit du contenu dans un fichier, en s'assurant que le chemin du fichier existe.


#### Recherche du Template

Le template utilisé pour rendre un doc est déterminer par `templateFinder`, celui-ci utilise le premier qui correspond
à un ensemble de patterns dans un ensemble de dossiers, fourni dans la configuration. Cela permet pas mal de contrôle pour fournir
des templates génériques pour la plupart des situations et des templates spécifiques pour des cas exceptionnels.

Voici un exemple de plusieurs patterns de template standard:

```js
templateFinder.templatePatterns = [
  '${ doc.template }',
  '${doc.area}/${ doc.id }.${ doc.docType }.template.html',
  '${doc.area}/${ doc.id }.template.html',
  '${doc.area}/${ doc.docType }.template.html',
  '${ doc.id }.${ doc.docType }.template.html',
  '${ doc.id }.template.html',
  '${ doc.docType }.template.html'
]
```

## Le package `git`

Ce package fournit plusieurs informations de git et des versions pour le `renderDocsPocessor` qui est utilisable
dans les templates. Ce code a été fait pour générer la documentation d'angular.js, il inclut une logique
personnalisée pour des versions particulières d'angular.js. Cependant, tous ces services peuvent être remplacés pour
avoir un autre comportement.

Les informations de git sont mises à la disposition des templates via la propriété `extraData.git`. Regardez la section
ci-dessous pour voir un exemple d'utilisation.

### Services

* `decorateVersion` - tous les semvers sont passés à travers cette fonction afin de mettre des données supplémentaires
avant de les ajouter.
* `getPreviousVersions` - récupère les versions depuis les tags de git tags du dépôt.
* `gitData` - les informations supplémentaires qui sont ajoutées à extraData de `renderDocsPocessor`.
* `gitRepoInfo` - Le nom du dépôt et du propriétaire du dépôt local de git.
* `packageInfo` - Le contenu du package.json.
* `versionInfo` - information des différentes versions et de git.

### Utilisation de `extraData.git`

Un exemple qui est utilisé dans `git/templates/api/api.template.html`

```html+jinja
<a href='https://github.com/{$ git.info.owner $}/{$ git.info.repo $}/tree/{$ git.version.isSnapshot and 'master' or git.version.raw $}/{$ doc.fileInfo.projectRelativePath $}#L{$ doc.startingLine $}' class='view-source pull-right btn btn-primary'>
  <i class="glyphicon glyphicon-zoom-in">&nbsp;</i>View Source
</a>
```


## Le package `nunjucks`

Ce package fournit une implémentation de `templateEngine` basé sur nunjucks, qui est requis par le
`renderDocsPocessor` du package `base`. La boite à outils de template Javascript de "nunjucks" génère du HTML
basé sur les données de chaque document. Nous avons les templates, les tags et les filtres de nunjucks qui
peuvent rendre des liens et du texte en markdown et mettre le code en évidence.

### Services

* `nunjucks-template-engine` - fournit un `templateEngine` qui utilise la bibliothèque de template de Nunjucks
pour rendre les documents en texte, tel que le HTML ou le JS, basé sur des templates.

## Le package `jsdoc`

### Les lecteurs de fichier

* `jsdoc` - peut lire les documentations depuis les commentaires (avec le style jsdoc) dans les fichiers contenant le code source.

### Processeurs

* `codeNameProcessor` - détermine le nom du document selon le code qui suit dans le document
dans le fichier source.
* `extractTagsProcessor` - utilise un `tagExtractor` pour extraire l'information depuis les balises analysées.
* `inlineTagsProcessor` - recherche les docs pour les balises [`inline`](http://usejsdoc.org/about-inline-tags.html) qui ont besoin d'avoir de l'injection de contenu
* `parseTagsProcessor` - utilise un `tagParser` pour analyser les balises de jsdoc dans le contenu du document.

### Définitions des balises

Le package `jsdoc` contient des définitions pour un certain nombre de balise standard de jsdoc : `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type`,
`kind`, `access`, `public`, `private` et `protected`.

### Services (Transformations de balise)

Ce package fournit un certain nombre de services **Transform** qui sont utilisés dans les **définitions de balise** pour transformer
la valeur de la balise depuis le string du commentaire en quelque chose de plus significatif dans le doc.

* `extractAccessTransform` - extrait un niveau d'accès (par exemple public, protected, private) depuis les tags
  Vous pouvez configurer cette transformation pour enregistrer les tags d'accès et définir la propriété où l'information de l'accès sera écrit.
  * `extractAccessTransform.allowedTags.set('tagName', [propertValue])` - enregistre un tag qui peut agir
    comme un alias pour définir un niveau d'accès. PropertyValue est facultatif et s'il n'est pas undefined, il retournera cette
    valeur de la transformation qui sera écrite dans la propriété. (par défaut à `public:undefined`,
    `private:undefined`, `protected:undefined`)
  * `extractAccessTransformImpl.allowedDocTypes.set('docType')` - enregistrer un docType qui peut contenir des tags
    de type d'accès (par défaut à "property" et "method")
  * `extractAccessTransformImpl.accessProperty` - spécifie la propriété dans laquelle il faut écrire la valeur de l’accès
    (par défaut à "access")
  * `extractAccessTransformImpl.accessTagName` - spécifie le nom du tag qui peut contenir des valeurs d'accès
    (par défaut à "access")
* `extractNameTransform` - extrait un nom à partir d'une balise
* `extractTypeTransform` - extrait un type à partir d'une balise
* `trimWhitespaceTransform` - enlève les espaces avant et après la valeur de la balise
* `unknownTagTransform` - ajouter une erreur à la balise si elle est inconnue
* `wholeTagTransform` -  utilise la balise comme valeur plutôt que d'utiliser une propriété de la balise
* `codeNameService` - service d'aide pour `codeNameProcessor`, enregistre les comparateurs de nom de code et effectue
 les correspondances avec l'aborescence AST

### Templates

**Ce package ne fournit pas de templates, ni un `templateEngine` pour rendre les templates (utilisez le
package `nunjucks` pour faire cela).**

### Définitions des balises

Ce package fournit une implémentation minimale des balises du projet JSDoc. Elles extraient le nom et
le type depuis la description de la balise trouvée, mais elles n'implémentent pas la totalité des fonctionnalités des balises JSDoc.

### Comparateurs de nom de code
Le comparateur effectue une recherche pour un nom de code approprié pour le point de code jsdoc donné (nœud de l’AST).
`codeNameService` fait correspondre le nom du nœud de l'AST avec le nom du comparateur et si un comparateur est trouvé, il l'exécute.

Le nom du comparateur est constitué des sous chaines de `<AstNodeName>` et `NodeMatcher`, par exemple `FunctionExpressionNodeMatcher`,
ensuite, ce dernier est enlevé et le comparateur est composé de la première partie, par exemple `FunctionExpression`.

Le comparateur devrait accepter un seul argument - un nœud et il retourne soit une chaine avec un nom ou la valeur littérale `null`.

Les comparateurs :
* `ArrayExpression`
* `ArrowFunctionExpression`
* `AssignmentExpression`
* `CallExpression`
* `ClassDeclaration`
* `ExportDefaultDeclaration`
* `ExpressionStatement`
* `FunctionDeclaration`
* `FunctionExpression`
* `Identifier`
* `Literal`
* `MemberExpression`
* `MethodDefinition`
* `NewExpression`
* `ObjectExpression`
* `Program`
* `Property`
* `ReturnStatement`
* `ThrowStatement`
* `VariableDeclaration`
* `VariableDeclarator`

## Le package `ngdoc`

Le package `ngdoc` dépend des packages `jsdoc` et `nunjucks`. Il offre un support complémentaire pour
les documents non-API écrits dans les fichiers avec l'extension `.ngdoc`. Il détermine également des propriétés
supplémentaires spécifiques au code correspondant à Angular.

### Les lecteurs de fichier

* `ngdoc` - peut extraire un document depuis un fichier qui contient du ngdoc.

### Processeurs

* `filterNgdocsProcessor` -
Pour AngularJS, nous sommes seulement intéressés aux documents qui contiennent les balises @ngdoc. Ce processeur
supprime les docs qui ne contiennent pas cette balise.

* `generateComponentGroupsProcessor` -
Génère des documents pour chaque groupe de composants (par type) dans un module

* `memberDocsProcessor` - Ce processeur relie les docs qui sont membres (propriétés, méthodes et événements) à
leurs docs contenants, et les retire de la collection des docs principaux.

* `moduleDocsProcessor` - Ce processeur détermine les propriétés pour les docs des modules tels que `packageName` et
`packageFileName`. Il ajoute les modules au service `moduleMap` et relie tous les docs qui sont dans un module
au doc du module dans la propriété `components`

* `providerDocsProcessor` - Ce processeur lie les documents sur les services angular au document de leur
provider correspondant.


### Définitions des balises

Ce package modifie et ajoute de nouvelles définitions de balises en plus de celles fournies par le package `jsdoc` :
`area`, `element`, `eventType`, `example`, `fullName`, `id`, `module`, `name`, `ngdoc`, `packageName`,
`parent`, `priority`, `restrict`, `scope` et `title`.


### Définitions des balises Inline

* `link` - Traite les balises Inline de lien (sous la forme {@link une/uri Un Titre}), en les remplaçant par
des ancres HTML


### Services

* `getAliases()` - Récupère une liste de tous les alias qui peuvent être faits à partir de la doc fournie
* `getDocFromAliases()` - Trouve un document depuis `aliasMap` qui correspond à l'alias donné
* `getLinkInfo()` - Récupère les informations du lien depuis un document qui correspond à l'url donnée
* `gettypeClass()` - Récupère un string de classe CSS pour un string de type donné
* `moduleMap` - Une collection de modules correspondant à l'id du module

### Templates

Ce package fournit également un ensemble de templates pour générer un fichier HTML pour chaque document : api,
directive, erreur, fonction de filtre, input, module, objet, aperçu, provider, service, type et un numéro
pour supporter le rendu des exemples exécutables.

Vous devez être conscient qu'en raison de la superposition dans la syntaxe entre la liaison de données de Nunjucks et celle d'AngularJS,
le package ngdoc change les balises de liaisons de données par défaut de Nunjucks :

```js
templateEngine.config.tags = {
  variableStart: '{$',
  variableEnd: '$}'
};
```

### Filtres de rendu

* `code` - Rend un span de text comme du code
* `link` - Rend un lien HTML
* `typeClass` - Rend une classe CSS pour un type donné

### Balises de rendu

* `code` - Rend un bloc de code


## Le package `examples`

Ce package est un mix qui fournit des fonctionnalités pour travailler avec des exemples dans les docs.

À l'intérieur de vos documents, vous pouvez baliser example de la manière suivante :

```
Du texte avant l'exemple

<example name="example-name">
  <file name="index.html">
    <div>Le HTML principal de l'exemple</div>
  </file>
  <file name="app.js">
    // Du code JavaScript à inclure dans l'exemple
  </file>
</example>

Du texte après l'exemple
```


### Processeurs

* `generateExamplesProcessor` - Ajoute les nouveaux docs à la collection de docs pour chaque exemple dans le service `examples` qui sera rendue
comme des fichiers qui peuvent être exécutés dans le navigateur, par exemple des démos en direct ou pour
des tests de e2e. Ce processeur doit être configuré avec une collection des différents déploiements qui lui indiquera
la version à générer pour chaque exemple . Voir la section de **Configuration de déploiement** ci-dessous.
* `parseExamplesProcessor` - Analyse les balises `<example>` depuis le contenu et les ajoute au service `examples`
* `generateProtractorTestsProcessor` - Génère les fichiers de test de protractor depuis les tests e2e dans les exemples. Ce processeur
doit être configuré avec une collection des différents déploiements qui lui indiquera la version des tests de protractor à générer. Voir la
section de **Configuration de déploiement** ci-dessous.

#### Configuration de déploiement

Les processeurs `generateExamplesProcessor` et `generateProtractorTestsProcessor` ont une propriété *obligatoire* appelée `deployments`.
Cette propriété doit être un tableau d'objets d'information de déploiement indiquant au processeur quels sont les fichiers à générer.

Par exemple, vous pourriez avoir un déploiement "debug" qui charge angular.js dans l'exemple et un déploiement "default" qui
charge angular.min.js dans l'exemple. De même, vous pourriez avoir des déploiements qui utilisent JQuery et certains qui utilisent
uniquement jqLite de Angular.

Vous pouvez configurer cela dans votre package comme ceci :

```js
.config(function(generateExamplesProcessor, generateProtractorTestsProcessor) {
  var deployments = [
    { name: 'debug', ... },
    { name: 'default', ... }
  ];

  generateExamplesProcessor.deployments = deployments;
  generateProtractorTestsProcessor.deployments = deployments;
});
```

Un déploiement doit avoir une propriété `name` et peut également inclure une propriété `examples` qui contient
des informations à propos du chemin et des fichiers supplémentaires à injecter dans des exemples.
De plus, un test de protractor est généré pour chaque déploiement et il utilise le nom du déploiement pour trouver le
chemin de l'exemple associé à ce déploiement.

```js
{
  name: 'default',
  examples: {
    commonFiles: {
      scripts: [ '../../../angular.js' ]
    },
    dependencyPath: '../../../'
  }
}
```

Ici nous avons un déploiement `default` qui injecte le fichier `angular.js` dans tous les exemples,
ainsi que les dépendances référencées dans l'exemple qui sont placées par rapport à la donnée `dependencyPath`.

### Définitions des balises Inline

* `runnableExample` -  Injecte l'exemple exécutable spécifié dans la doc


### Services

* `exampleMap` - une map contenant chaque exemple par un id. Cet id est généré de façon unique à partir
du nom de l'exemple


## Le package `typescript`

### Les lecteurs de fichier

* Pour le moment, nous n'avons pas utiliser un lecteur de fichier mais un processeur `readTypeScriptModules` pour lire nos modules.

### Processeurs

* `readTypeScriptModules` - analyse le `sourceFiles` à l'aide du service `tsParser` et retourne un doc
pour chaque membre exporté. Vous pouvez passer soit un tableau de chaînes ou un tableau d'objets avec les patterns
`include` et `exclude`. Un mélange des deux est aussi possible.
Le processeur peut être configuré pour exporter des membres
(privés) private (marqués avec `/** @internal */`, de la même manière que les membres démarrant avec un underscore (`_`)) en définnisant la propriété
`hidePrivateMembers` à `false`.
Définnisez `sortClassMembers` à `true` pour trier l'instance et les mebres static par le nom (par défaut, c'est l'ordre d'apparition).
Vous pouvez ignorer les exportations spéciales en ajoutant des chaînes ou des regex à la propriété `ignoreExportsMatching` (par défaut à
`___esModule`.

### Services

* `convertPrivateClassesToInterfaces` - passe à ce service une liste de docs exportés et si elle représente une
classe qui est marquée avec comme `/** @internal */`, le doc sera converti pour représenter une interface.
* `tsParser` - utilise le compilateur typescript et un hôte, créé par `createCompilerHost`, lit et compile
les fichiers sources. Les docs sont créés à partir des symboles lu par le programme typescript.
* `createCompilerHost` - crée un nouvel hôte du compilateur qui peut, entre autres, résoudre les chemins des fichiers et
vérifier si les fichiers existent
* `getContent` - récupère le contenu du fichier et des commentaires.

### Templates

**Ce package ne fournit pas de templates, ni un `templateEngine` pour rendre les templates (utilisez le
package `nunjucks` pour faire cela).**

### Définitions des balises
Veuillez noter que pour le moment la documentation de `@param` est ignorée.
