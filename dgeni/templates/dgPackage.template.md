# {$ doc.name $} package

{$ doc.description | marked $}

## Dependencies

{% for dependency in doc.dependencies %}
* {@link {$ dependency.name $} }
{% endfor %}


## Processors

{% for processor in doc.processors %}
* {@link {$ processor.id $} }
{% endfor %}

### Services

{% for service in doc.services %}
* {$ service.name $}
{% endfor %}
