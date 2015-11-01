{% include 'partials/header.template.md' %}
## {$ doc.name $} processor {% if not doc.$process %}*(pseudo)*{% endif %}
**from {@link {$ doc.packageDoc.id $} } package**

{$ doc.description $}

## Properties

{% if doc.$runAfter %}
### Run After

{% for processor in doc.$runAfter %}
* {@link {$ processor $} }
{% endfor %}
{% endif %}

{% if doc.$runBefore %}
### Run Before

{% for processor in doc.$runBefore %}
* {@link {$ processor $} }
{% endfor %}
{% endif %}

{% if doc.$validate %}
### Validation

{% for key, value in doc.$validate %}
* {$ key $} - {$ value | json $}
{% endfor %}
{% endif %}
