cd frontend

jsdoc -r ./src/

npx eslint --ext .js,.jsx,.ts,.tsx . -f node_modules/eslint-html-reporter/reporter.js -o report.html

npm test -- --coverage --watchAll=false

cd ..

pylint ./backend --ignore=env --output-format=json > ./backend/pylint.json

cd backend

pylint-json2html -o pylint.html pylint.json

pytest --cov --cov-report=html:cov

