{% include 'partials/header.template.md' %}
## {$ doc.name $} package

{$ doc.description $}

### Dependencies

{% if doc.dependencies.length %}
This package depends upon:
{% else %}
This package has no dependencies.
{% endif %}
{% for dependency in doc.dependencies %}
* {@link {$ dependency.name $} }
{% endfor %}

### Processors

{% if doc.processors.length %}
Processors that are defined in this package:
{% else %}
There are no processors defined in this package.
{% endif %}
{% for processor in doc.processors %}
* **{@link {$ processor.id $} }**
{$ processor.description $}
{% endfor %}

### Services

{% if doc.services.length %}
Services that are defined in this package:
{% else %}
There are no services defined in this package.
{% endif %}
{% for service in doc.services %}
* **{@link {$ service.id $} }**
{$ service.description $}
{% endfor %}

### Pipeline

The full pipeline of processors for this package:

{% for p in doc.pipeline %}
* {% if p.$process %}**{% endif %}{@link {$ p.id $} {$ p.name $} }{% if p.$process %}**{% endif %}
  ({@link {$ p.packageDoc.id $} {$ p.packageDoc.name $} }){% endfor %}

