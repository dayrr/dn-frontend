#!/bin/bash
sed -i 's|#HOST#|'${BEHOST}'|g' /usr/share/nginx/html/static/js/app.b12d1c94.js
sed -i 's|#DATAVERSE#|'${DATAVERSE}'|g' /usr/share/nginx/html/static/js/app.b12d1c94.js
sed -i 's|#GRAPHDB#|'${GRAPHDB}'|g' /usr/share/nginx/html/static/js/app.b12d1c94.js
sed -i 's|http://melodi.irit.fr/datanoos/|'${HOST}'|g' /usr/share/nginx/html/index.html
exec "$@"


