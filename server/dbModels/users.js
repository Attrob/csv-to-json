const database = require("./index");
const { mandatory_fields } = require("../appConstants/constants");

async function uploadUserData(data) {
    let isSuccessful = false;
    await database.transaction(async (t) => {
        try{
            for (const record of data){                
                const firstName = record.name.firstName;
                const lastName = record.name.lastName;
                const fullName = firstName + " " + lastName;
                const age = record.age;
                const address = record.address;

                const additionalData = Object.entries(record)
                .filter(([key]) => !mandatory_fields.includes(key))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

                await t('users')
                .insert({
                    name: fullName,
                    age: age,
                    address: address,
                    additional_info: additionalData
                })
                .transacting(t);
            }
            await t.commit();
            isSuccessful = true;
            console.log("Data inserted successfully");
        }catch(error){
            await t.rollback();
            console.log("Error in uploading user data:", error);
        }
    });
    return isSuccessful;             
}

async function fetchUserStats() {
    try{
        const query = "SELECT age, COUNT(*) FROM users GROUP BY age;";
        const data = await database.raw(query);
        const rows = data?.rows;

        const dataProjection = {
            "< 20": 0,
            "20 to 40": 0,
            "40 to 60": 0,
            "> 60": 0
        };

        let totalRecords = 0;

        for (const record of rows) {
            const count = +(record.count);
            totalRecords += count;
            const age = record.age;
            if (age < 20){
                dataProjection["< 20"] += count;
            }else if (age >= 20 && age < 40){
                dataProjection["20 to 40"] += count;
            }else if (age >= 40 && age < 60){
                dataProjection["40 to 60"] += count;
            }else{
                dataProjection["> 60"] += count;
            }
        }

        const formattedData = Object.entries(dataProjection)
        .map(([key, value]) => ({ "Age-Group": key, "% Distribution": +(value/totalRecords*100) }));
        
        return formattedData;
    }catch(error){
        console.log("Error in fetching user stats data:", error);
    }          
}



module.exports = { uploadUserData, fetchUserStats };