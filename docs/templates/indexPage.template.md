{% include 'partials/header.template.md' %}

These docs describe the packages stored in the dgeni-packages project

## Packages

{% for p in doc.packages %}
* {@link {$ p.id $} }<br>{$ p.description $}
{% endfor %}