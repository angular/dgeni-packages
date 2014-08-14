# Dgeni Packages

Ce dépôt contient une collection de packages de Dgeni qui peuvent être utilisés par Dgeni, le générateur
de documentation, pour créer une documentation à partir du code source.


Actuellement, il y a les packages suivants :

* base - L'ensemble minimal des processeurs pour commencer avec Dgeni
* jsdoc - Extraction et analyse des balises
* nunjucks - Le moteur de rendu de template de nunjucks. Comme il n'est plus dans jsdoc, vous devez l'ajouter
  explicitement dans votre configuration ou vous obtiendrez l'erreur
  `Error: No provider for "templateEngine"! (Resolving: templateEngine)`
* ngdoc - La partie spécifique d'angular.js, avec la définition des balises, des processeurs et des templates.
  Celui-ci charge les packages de jsdoc et nunjucks pour vous.
* examples - Processeurs pour supporter les exemples exécutables qui figurent sur les docs du site d'angular.js.
* dgeni - support pour la documentation des packages de Dgeni

## Le package `base`

### Processeurs

* `debugDumpProcessor` - extrait l'état courant du tableau docs dans un fichier (désactivé par défaut)
* `readFilesProcessor` - utilisé pour charger les documents depuis les fichiers. Ce processeur peut-être configuré pour utiliser
un ensemble de **lecteur de fichier**. Il y a des lecteurs de fichiers (file-readers) dans les packages `jsdoc` et `ngdoc`.
* `computePathsProcessor` - Détermine le `path` et le `outputPath` des documents en utilisant des templates ou des fonctions
d'aide, sur la base du `docType`.
* `renderDocsProcessor` - rendre les documents dans une propriété (`doc.renderedContent`) en utilisant
un `templateEngine` (moteur de template), qui doit être fourni séparément - voir le package `nunjucks`.
* `unescapeCommentsProcessor` - reformatte les marqueurs de commentaires pour ne pas casser le style des commentaires de jsdoc,
par exemple `*/`
* `writeFilesProcessor` - écrit les docs (pour ceux ont un `outputPath`) sur le disque

### Services

* `createDocMessage` - une aide pour créer de beaux messages à prpopos des documents (utile pour les logs et
les erreurs)
* `encodeDocBlock` - convertir un bloc de code en HTML
* `templateFinder` - recherche dans les répertoires à l'aide de modèle (pattern) pour trouver un template qui correspond au document donné.
* `trimIndentation` - coupe "intelligemment" l'indentation dès le début de chaque ligne d'un bloc
de texte.


Le template utilisé pour rendre le doc est déterminer par `templateFinder`, celui-ci utilise le premier qui correspond
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


## Le package `nunjucks`

Ce package fournit une implémentation de `templateEngine` basé sur nunjucks, qui est requis par le
`renderDocsPocessor` du package `base`. La boite à outils de template Javascript de "nunjucks" génére du HTML
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
* `parseTagsProcessor` - utilise un `tagParser` pour analyser les balises de jsdoc dans le contenu du document.
* `extractTagsProcessor` - utilise un `tagExtractor` pour extraire l'information depuis les balises analysées.
* `inlineTagsProcessor` - recherche les docs pour les balises [`inline`](http://usejsdoc.org/about-inline-tags.html) qui ont besoin d'avoir de l'injection de contenu

### Définitions des balises

Le package `jsdoc` contient des définitions pour un certain nombre de balise standard de jsdoc : `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type` et
`kind`.

### Services (Transformations de balise)

Ce package fournit un certain nombre de services **Transform** qui sont utilisés dans les **définitions de balise** pour transformer
la valeur de la balise depuis le string du commentaire en quelque chose de plus significatif dans le doc.

* `extractNameTransform` - extrait un nom à partir d'une balise
* `extractTypeTransform` - extrait un type à partir d'une balise
* `trimWhitespaceTransform` - enlève les espaces avant et après la valeur de la balise
* `unknownTagTransform` - ajouter une erreur à la balise si elle est inconnue
* `wholeTagTransform` -  Utilise la balise comme valeur plutôt que d'utiliser une propriété de la balise

### Templates

**Ce package ne fournit pas de templates, ni un `templateEngine` pour rendre les templates (utilisez le
package `nunjucks` pour faire cela).**

### Définitions des balises

Ce package fournit une implémentation minimale des balises du projet JSDoc. Elles extraient le nom et
le type depuis la description de la balise trouvée, mais elles n'implémentent pas la totalité des fonctionnalités des balises JSDoc.

## Le package `ngdoc`

Le package `ngdoc` dépend des packages `jsdoc` et `nunjucks`.

### Les lecteurs de fichier

* `ngdoc` - peut extraire un document depuis un fichier qui contient du ngdoc.

### Processeurs

* `apiDocsProcessor` -

Ce processeur exécute des processus qui sont spécifiquement liées à la documentation pour les composants de l'API. Il fait ce qui suit :

  - Détermine le nom du package pour le module (par exemple angular ou angular-sanitize)
  - Collecte tous les documents qui appartiennent au module
  - Les attache à la doc du module dans la propriété `components`
  - Détermine le chemin de l'URL vers le document dans l'application docs et le chemin de destination (OutputPath) du fichier final
  - Il relie les documents des services d'angular avec les documents des provider correspondant.

apiDocsProcessor a les options de configuration suivantes de disponibles (énumérés avec les valeurs par défaut) :

  ```js
  apiDocsProcessor.apiDocsPath = undefined; // C'est une propriété obligatoire qui doit être définie
  apiDocsProcessor.outputPathTemplate = '${area}/${module}/${docType}/${name}.html', // Le chemin pour écrire la page d'un document de l'api.
  apiDocsProcessor.apiPathTemplate = '${area}/${module}/${docType}/${name}', // L'url pour la page du document.
  apiDocsProcessor.moduleOutputPathTemplate = '${area}/${name}/index.html', // Le chemin pour écrire la page d'un module de l'api.
  apiDocsProcessor.modulePathTemplate = '${area}/${name}' // L'url pour la page du module.
  ```

* `generateComponentGroupsProcessor` -
Génère des documents pour chaque groupe de composants (par type) dans un module

* `computeIdProcessor` -
Détermine la propriété id du doc sur la base des balises et d'autres méta-données

* `filterNgdocsProcessor` -
Pour AngularJS, nous sommes seulement intéressés aux documents qui contiennent les balises @ngdoc. Ce processeur
supprime les docs qui ne contiennent pas cette balise.

* `collectPartialNames` -
Ajoute tous les docs à `partialNameMap`


### Définitions des balises

Ce package modifie et ajoute de nouvelles définitions de balises en plus de celles fournies par le package `jsdoc`.


### Définitions des balises Inline

* `link` - Traite les balises Inline de lien (sous la forme {@link une/uri Un Titre}), en les remplaçant par
des ancres HTML


### Services

* `getLinkInfo()` - Récupère les informations du lien depuis un document qui correspond à l'url donné
* `getPartialNames()` - Récupère une liste de tous les noms de code de partiel qui peuvent être utilisés à partir d'un ensemble
donné
* `gettypeClass()` - Récupère un string de classe CSS pour un string de type donné
* `moduleMap` - Une collection de modules correspondant au nom du module
* `parseCodeName()` - Découpe le nom de code en plusieurs morceaux
* `patialNameMap` - Une map de nom de partiel pour les docs


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

* `parseExamplesProcessor` -
Analyse les balises `<example>` depuis le contenu et les ajoute au service `examples`
* `generateExamplesProcessor` -
Ajoute les nouveaux docs à la collection de docs pour chaque exemple dans le service `examples` qui sera rendue
comme des fichiers qui peuvent être exécutés dans le navigateur, par exemple en direct des démos ou pour
des tests de e2e.
* `generateProtractorTests` - Génère les fichiers de test de protractor depuis les tests e2e dans les exemples

### Définitions des balises Inline

* `runnableExample` -  Injecte l'exemple exécutable spécifié dans la doc


### Services

* `exampleMap` - une map contenant chaque exemple par un id. Cet id est généré de façon unique à partir
du nom de l'exemple

