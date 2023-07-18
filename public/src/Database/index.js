const DataType = {
    TEXT: "TEXT",
    NUMBER: "NUMBER",
    OBJECT: "OBJECT",
    LIST: "LIST"
}

function generateRandomSongs() {
    const songs = [];

    // Create artists
    const artist1 = new Artist("Artist 1", "path/to/artist1.jpg");
    const artist2 = new Artist("Artist 2", "path/to/artist2.jpg");
    const artist3 = new Artist("Artist 3", "path/to/artist3.jpg");
    const artist4 = new Artist("Artist 4", "path/to/artist4.jpg");
    const artist5 = new Artist("Artist 5", "path/to/artist5.jpg");
    const artist6 = new Artist("Artist 6", "path/to/artist6.jpg");

    // Create albums
    const album1 = new Album("Album 1", 2020, "path/to/album1.jpg", [artist1, artist2]);
    const album2 = new Album("Album 2", 2019, "path/to/album2.jpg", [artist3, artist4]);
    const album3 = new Album("Album 3", 2021, "path/to/album3.jpg", [artist5, artist6]);

    // Create songs
    songs.push(new Song("path/to/song1.mp3", "Song 1", album1, [artist1]));
    songs.push(new Song("path/to/song2.mp3", "Song 2", album1, [artist2]));
    songs.push(new Song("path/to/song3.mp3", "Song 3", album2, [artist3]));
    songs.push(new Song("path/to/song4.mp3", "Song 4", album2, [artist4]));
    songs.push(new Song("path/to/song5.mp3", "Song 5", album3, [artist5]));
    songs.push(new Song("path/to/song6.mp3", "Song 6", album3, [artist6]));
    songs.push(new Song("path/to/song7.mp3", "Song 7", album1, [artist1, artist2]));
    songs.push(new Song("path/to/song8.mp3", "Song 8", album2, [artist3, artist4]));
    songs.push(new Song("path/to/song9.mp3", "Song 9", album3, [artist5, artist6]));
    songs.push(new Song("path/to/song10.mp3", "Song 10", album1, [artist1, artist2]));

    return songs
}


class Database {

    db
    entities = []

    constructor() {
        this.db = require('better-sqlite3')("test.db")
    }

    register = (Cls) => {
        const clsInst = new Cls()
        this.entities.push({
            new: (...args) => new Cls(...args),
            className: Cls.name,
            properties: Object.keys(clsInst)
                .filter((key) => key.startsWith("_"))
                .map((key) => ({ name: key.substring(1), ...(clsInst[key]) }))
        })
    }

    /**
     * Create tables for registered entities.
     * @param force Boolean
     * Will drop tables before create if force is set to `true`
     */
    sync = (force = false) => {
        const createTableScript = this.entities.map((entity) => {
            const tableName = entity.className
            const properties = entity.properties
            const primaryKeys = []
            const foreignKeys = []
            let extraTables = ''
            let createTableScript = `${force ? `DROP TABLE IF EXISTS ${tableName};` : ""} CREATE TABLE IF NOT EXISTS ${tableName} (`

            properties.forEach((property) => {
                let propertyName = property.name
                let propertyType = property.type ?? "TEXT"

                if (propertyType === DataType.LIST) {
                    const target = property.target

                    const targetPk = properties.find((pt) => pt.name = property.pk)
                    const targetVia = this.entities.find(et => et.className === target).properties.find((pt) => pt.name === property.via)
                    extraTables += `${force ? `DROP TABLE IF EXISTS ${tableName}_${target};` : ""} CREATE TABLE IF NOT EXISTS ${tableName}_${target} (
                    ${tableName}_${property.pk} ${targetPk.type ?? "TEXT"},
                    ${target}_${property.via} ${targetVia.type ?? "TEXT"},
                    FOREIGN KEY(${tableName}_${property.pk}) REFERENCES ${tableName}(${property.pk}),
                    FOREIGN KEY(${target}_${property.via}) REFERENCES ${target}(${property.via}),
                    PRIMARY KEY(${tableName}_${property.pk}, ${target}_${property.via})
                );`

                } else {
                    if (propertyType === DataType.OBJECT) {
                        foreignKeys.push(`FOREIGN KEY(${propertyName}) REFERENCES ${property.target}(${property.via})`)
                        propertyType = DataType.TEXT
                    }
                    if (property.primaryKey) primaryKeys.push(propertyName)
                    createTableScript += `${propertyName} ${propertyType}, `
                }

            })
            createTableScript += `PRIMARY KEY (${primaryKeys.join(", ")})`

            if (foreignKeys.length > 0) createTableScript += `, ${foreignKeys.join(",")}`

            createTableScript += ");"

            createTableScript += extraTables

            return createTableScript
        }).join("")
        console.log(createTableScript)
        this.db.exec(`PRAGMA foreign_keys = off; ${createTableScript} PRAGMA foreign_keys = on;`)
    }

    /**
     * INSERT or UPDATE registered entities. Child object will be nested `upsert()` as well.
     * @param data : RegisteredEntity||RegisteredEntity[]
     */
    upsert = (data) => {

        // Input data should be a List.
        if (data.constructor.name !== "Array") data = [data]

        // Find registered entity by className from first object.
        // We assume that input data have the same type.
        const entityClass = this.entities.find(ett => ett.className === data[0].constructor.name)

        // If object is registered entity
        if (entityClass) {

            // Get entity properties that is not List (M-N Relationship)
            const simpleProperties = entityClass.properties.filter(ppt => ppt.type !== DataType.LIST)

            // Prepare the update query by non-list properties
            let updateQuery = this.db.prepare(`INSERT OR REPLACE INTO ${entityClass.className} (${simpleProperties.map((prop) => `${prop.name}`).join(", ")}) VALUES (${simpleProperties.map((prop) => `@${prop.name}`).join(", ")})`)

            // Loop through input data
            data.forEach((obj) => {

                // Loop through non-list properties
                let values = simpleProperties.map((prop) => {

                    // Default key value pairs
                    let key = prop.name
                    let value = obj[prop.name]

                    // 1-N relationship
                    if (prop.type === DataType.OBJECT) {

                        // Upsert the target object
                        this.upsert(value)

                        // Store the foreign key
                        value = value[prop.via]
                    }

                    return [key, value]
                })

                // Execute script
                updateQuery.run(Object.fromEntries(values))

                // Loop through M-N relationships
                entityClass.properties.filter((props) => props.type === DataType.LIST).map((prop) => {

                    // Upsert the target object list
                    let value = obj[prop.name]
                    this.upsert(value)

                    // Insert relationships
                    const target = prop.target
                    const insertQuery = this.db.prepare(`INSERT OR REPLACE INTO ${entityClass.className}_${target} (${entityClass.className}_${prop.pk}, ${target}_${prop.via}) VALUES (?, ?)`)
                    value.map((targetObj) => insertQuery.run(obj[prop.pk], targetObj[prop.via]))
                })

            })
        }
    }

    /**
     * 
     * @param query Object
     * - `query.table`
     * - `query.where`
     * 
     */
    select = (query, values) => {
        return this.db.prepare(query).all(values)
    }


    get = (table, condition, conditionParam) => {
        const entityClass = this.entities.find(ett => ett.className === table)
        let res = []
        if (condition) {
            res = this.db.prepare(`SELECT * FROM ${entityClass.className} ${condition}`).all(conditionParam)
        } else {
            res = this.db.prepare(`SELECT * FROM ${entityClass.className}`).all()
        }
        for (let i = 0; i < res.length; i++) {
            let row = res[i];
            let inst = entityClass.new();

            for (let j = 0; j < entityClass.properties.length; j++) {
                let prop = entityClass.properties[j];

                if (prop.type === DataType.LIST) {
                    const target = prop.target
                    inst[prop.name] = this.get(prop.target, `JOIN ${entityClass.className}_${target} ON ${entityClass.className}_${target}.${target}_${prop.via} = ${target}.${prop.via} WHERE ${entityClass.className}_${target}.${entityClass.className}_${prop.pk} = ?`, row[prop.pk])
                } else if (prop.type === DataType.OBJECT) {
                    const target = prop.target
                    inst[prop.name] = this.get(prop.target, `WHERE ${target}.${prop.via} = ?`, row[prop.name]).at(0)
                } else {
                    inst[prop.name] = row[prop.name];
                }
            }
            res[i] = inst;
        }
        return res
    }
}

module.exports = Database