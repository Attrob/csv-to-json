# CSV to JSON

Welcome
A CSV to JSON convertor API. Each row in the CSV file will represent one object and a file
with multiple rows will be converted to a list of objects.
The fields in the csv files will be properties inside the object. A complex property will be named with a dot (.) separator.


# Requirements and versions:

node: 20.10.0     

express: 4.19.1     

knex: 3.1.0   

pg: 8.11.3    


# Start to Finish

1. Clone the repository
2. Install node and postgres RDBMS
3. Install the dependencies in package.json file. Use "npm i".
4. Configure database and use the following command to create the users table.     
    CREATE TABLE public.users (
        id SERIAL PRIMARY KEY NOT NULL,  
        "name" VARCHAR(255) NOT NULL,  
        age INTEGER NOT NULL,          
        address JSONB DEFAULT NULL,   
        additional_info JSONB DEFAULT NULL
    );
5. Modify the user data present in the dummy_data.csv file. Play with it!
6. Start the project using "npm start". In case the port 4004 is already in use. Use some other available port. You can configure this in .env file.
7. Use the below cURL in postman to test the API.      

    curl --location --request POST 'http://localhost:4004/api/v1/csv-to-json' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "file_path": "./server/dummy_data.csv"
    }'
8. Finally! Observe the user age dynamics in the console in tabular form.


Hope this helps! Please feel free to reachout.
Thank you!

Cheers!






