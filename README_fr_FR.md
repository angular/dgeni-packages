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

#### Le package `base`

Ce package contient les processeurs suivants :

* `read-files` - utilisé pour charger les documents depuis les fichiers. Ce processeur peut-être configuré pour utiliser
un ensemble de **lecteur de fichier**. Il y a des lecteurs de fichiers (file-readers) dans les packages `jsdoc` et `ngdoc`.
* `render-docs` - rendre les documents dans une propriété (`doc.renderedContent`) en utilisant
un `templateEngine` (moteur de template), qui doit être fourni séparément - voir le package `nunjucks`.
* `templateFinder` - recherche dans les répertoires à l'aide de modèle (pattern) pour trouver un template qui correspond au document donné.
* `unescape-comments` - reformatte les marqueurs de commentaires pour ne pas casser le style des commentaires de jsdoc,
par exemple `*/`
* `write-files` - écrit les docs sur le disque

#### Le package `nunjucks`

Ce package fournit une implémentation de `templateEngine` basé sur nunjucks, qui est requis par le
processeur `render-docs` du package `base`.

* `nunjucks-template-engine` - fournit un `templateEngine` qui utilise la bibliothèque de template de Nunjucks
pour rendre les documents en texte, tel que le HTML ou le JS, basé sur des templates.

#### Le package `jsdoc`

Ce package contient le lecteur de fichier (file-readers) suivant :

* `jsdoc` - peut lire les documentations depuis les commentaires (avec le style jsdoc) dans les fichiers contenant le code source.

Ce package contient les processeurs suivants :

* `code-name` - détermine le nom du document selon le code qui est placé après la documention
dans le fichier source.
* `compute-path` - détermine le chemin du document, utilisé pour écrire le fichier et pour naviguer
vers le document dans une application web.
* `defaultTagTransforms` - fournit une collection de fonction de transformation des balises à appliquer à chaque balise.
Regardez les transformations dans le processeur `tagExtractor`.
* `parse-tags` - utilise un `tagParser` pour analyser les balises de jsdoc dans le contenu du document.
* `extract-tags` - utilise un `tagExtractor` pour extraire l'information depuis les balises analysées.
* `inline-tags` - recherche les docs pour les balises [`inline`](http://usejsdoc.org/about-inline-tags.html)
qui ont besoin d'avoir de l'injection de contenu
* `tagDefinitions` - fournit une collection de définitions de balise, et une map de la même façon, utilisé par
`tagParser` et `tagExtractor`.
* `tagExtractor` - fournit un service pour extraire l'information des balises et la convertir en des propriétés
spécifiques sur le document, basé sur un ensemble de définitions de balise.
Le package `jsdoc` contient des définitions pour un certain nombre de balise standard de jsdoc : `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type` et
`kind`.
* `tagParser` - fournit un service pour analyser le contenu d'un document pour récupérer toutes les balises
de style jsdoc.

**Ce package ne fournit pas de templates, ni un `templateEngine` pour rendre les templates (utilisez le
package `nunjucks` pour faire cela).**

### Le package `ngdoc`

Le package `ngdoc` charge automatiquement les packages `jsdoc` et `nunjucks`.

Ce package contient les lecteurs de fichiers suivants, en plus de ceux prévus par le
package `jsdocs` :

* `ngdoc` - peut extraire un document depuis un fichier qui contient du ngdoc.

En plus des processeurs fournis par le package `jsdoc`, ce package ajoute les processeurs suivants :

* `api-docs` -

Ce processeur exécute des processus qui sont spécifiquement liées à la documentation pour les composants de l'API. Il fait ce qui suit :

  - Détermine le nom du package pour le module (par exemple angular ou angular-sanitize)
  - Collecte tous les documents qui appartiennent au module
  - Les attache à la doc du module dans la propriété `components`
  - Détermine le chemin de l'URL vers le document dans l'application docs et le chemin de destination (OutputPath) du fichier final
  - Il relie les documents des services d'angular avec les documents des provider correspondant.

api-docs a les options de configuration suivantes de disponibles (énumérés avec les valeurs par défaut) :

  ```js
  config.set('processing.api-docs', {
    outputPath: '${area}/${module}/${docType}/${name}.html', // Le chemin pour écrire la page d'un document de l'api.
    path: '${area}/${module}/${docType}/${name}', // L'url pour la page du document.
    moduleOutputPath: '${area}/${name}/index.html', // Le chemin pour écrire la page d'un module de l'api.
    modulePath: '${area}/${name}' // L'url pour la page du module.
  });
  ```

* `component-groups-generate` -

* `compute-id` -

* `filter-ngdocs` -
Pour AngularJS, nous sommes seulement intéressés aux documents qui contiennent les balises @ngdoc. Ce processeur
supprime les docs qui ne contiennent pas cette balise.

* `partial-names` -


Ce package fournit également un ensemble de templates pour générer un fichier HTML pour chaque document : api,
directive, erreur, fonction de filtre, input, module, objet, aperçu, provider, service, type et un numéro
pour supporter le rendu des exemples exécutables.

Vous devez prendre conscience qu'à cause de la double utilisation dans la syntaxe des liaisons de Nunjucks et des liaisons d'AngularJS,
le package ngdoc change les balises de liaison par défaut de Nunjucks :

```
config.merge('rendering.nunjucks.config.tags', {
    variableStart: '{$',
    variableEnd: '$}'
  });
```

### Le package `examples`

Ce package est un mix qui fournit des processeurs supplémentaires pour travailler avec des exemples dans les docs :

* `examples-parse` -
Analyse les balises `<example>` depuis le contenu, la création des nouvelles docs seront convertis en fichiers
supplémentaires qui pourront être chargés par l'application et utilisés, par exemple, en direct dans des démos
d'exemples et des tests de bout en bout.
* `examples-generate` -



## Rendu HTML

Nous rendons chacun de ces documents comme une page HTML. Nous utilisons le moteur de template Javascript
"nunjucks" pour générer du code HTML basé sur les données de chaque document. Nous avons des balises nunjucks
et des filtres qui peuvent rendre des liens et du texte markdown et mettre en évidence le code.

Le template utilisé pour rendre le doc est calculé par un `templateFinder` (Chercheur de template), qui utilise le premier qui correspond
à un ensemble de modèle (pattern) dans un ensemble de dossiers, fourni dans la configuration. Cela permet beaucoup de contrôle
pour fournir des templates génériques pour la plupart des situations et des templates spécifiques pour des cas exceptionnels.

Voici un exemple de modèle d'angularjs :

```
rendering: {

      ...

      templatePatterns: [
        '${ doc.template }',
        '${ doc.id }.${ doc.docType }.template.html',
        '${ doc.id }.template.html',
        '${ doc.docType }.template.html'
      ],

      ...

      templateFolders: [
        'templates'
      ]

    },
```
