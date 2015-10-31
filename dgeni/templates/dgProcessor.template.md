# {$ doc.name $} processor {% if not doc.$process %}*(pseudo)*{% endif %}
## from {$ doc.packageDoc.name $} package

{$ doc.description | marked $}

## Properties

{% if doc.$runAfter %}
### Run After

{% for processor in doc.$runAfter %}
* {$ processor $}
{% endfor %}
{% endif %}

{% if doc.$runBefore %}
### Run Before

{% for processor in doc.$runBefore %}
* {$ processor $}
{% endfor %}
{% endif %}

{% if doc.$validate %}
### Validation

{% for key, value in doc.$validate %}
* {$ key $} - {$ value | json $}
{% endfor %}
{% endif %}
