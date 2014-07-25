# Dgeni Packages

Ce dépôt contient une collection de packages de dgeni qui peuvent être utilisés par dgeni, le générateur
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

## Le package `base`

### Processeurs

* `debugDumpProcessor` - extrait l'état courant du tableau docs dans un fichier (désactivé par défaut)
* `readFilesProcessor` - utilisé pour charger les documents depuis les fichiers. Ce processeur peut-être configuré pour utiliser
un ensemble de **lecteur de fichier**. Il y a des lecteurs de fichiers (file-readers) dans les packages `jsdoc` et `ngdoc`.
* `renderDocsProcessor` - rendre les documents dans une propriété (`doc.renderedContent`) en utilisant
un `templateEngine` (moteur de template), qui doit être fourni séparément - voir le package `nunjucks`.
* `unescapeCommentsProcessor` - reformatte les marqueurs de commentaires pour ne pas casser le style des commentaires de jsdoc,
par exemple `*/`
* `writeFilesProcessor` - écrit les docs sur le disque

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
* `computePathProcessor` - détermine le chemin du document, utilisé pour écrire le fichier et pour naviguer
vers le document dans une application web.
* `parseTagsProcessor` - utilise un `tagParser` pour analyser les balises de jsdoc dans le contenu du document.
* `extractTagsProcessor` - utilise un `tagExtractor` pour extraire l'information depuis les balises analysées.
* `inlineTagsProcessor` - recherche les docs pour les balises [`inline`](http://usejsdoc.org/about-inline-tags.html) qui ont besoin d'avoir de l'injection de contenu

### Définitions des balises

Le package `jsdoc` contient des définitions pour un certain nombre de balise standard de jsdoc : `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type` et
`kind`.

### Services

Ce package fournit un certain nombre de services tagTransform qui sont utilisés dans les définitions de balise pour transformer
la valeur de la balise depuis le string dans le commentaire en quelque chose de plus significatif dans le doc.

* `extractNameTransform` - extrait un nom à partir d'une balise
* `extractTypeTransform` - extrait un type à partir d'une balise
* `trimWhitespaceTransform` - enlève les espaces avant et après la valeur de la balise
* `unknownTagTransform` - ajouter une erreur à la balise si elle est inconnue
* `wholeTagTransform` -  Utilise la balise comme valeur plutôt que d'utiliser une propriété de la balise

### Templates

**Ce package ne fournit pas de templates, ni un `templateEngine` pour rendre les templates (utilisez le
package `nunjucks` pour faire cela).**

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
  });
  ```

* `generateComponentGroupsProcessor` -
Génère des documents pour chaque groupe de composants (par type) dans un module

* `computeIdProcessor` -
Détermine la propriété id du doc sur la base des balises et d'autres méta-données

* `computePathProcessor` -
Détermine path et outputPath pour les docs qui n'ont pas déjà

* `filterNgdocsProcessor` -
Pour AngularJS, nous sommes seulement intéressés aux documents qui contiennent les balises @ngdoc. Ce processeur
supprime les docs qui ne contiennent pas cette balise.

* `collectPartialNames` -
Ajoute tous les docs à partialNameMap


### Services

* `getLinkInfo()`
* `getPartialNames()`
* `gettypeClass()`
* `moduleMap`
* `parseCodeName()`
* `patialNameMap`


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

## Le package `examples`

Ce package est un mix qui fournit des fonctionnalités pour travailler avec des exemples dans les docs.

### Processeurs

* `parseExamplesProcessor` -
Analyse les balises `<example>` depuis le contenu et les ajoute au service `examples`
* `generateExamplesProcessor` -
Ajoute les nouveaux docs à la collection de docs pour chaque exemple dans le service `examples` qui sera rendue
comme des fichiers qui peuvent être exécutés dans le navigateur, par exemple en direct des démos ou pour
des tests de e2e.

### Services

* examples - une map contenant chaque exemple par le nom

