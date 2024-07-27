import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('gym');


const updateWorkouts = () => {
    //db.execSync('DROP TABLE IF EXISTS profile')

    //WORKOUTS
    db.execSync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS workout (
        id INTEGER PRIMARY KEY NOT NULL, 
        title TEXT,
        exercises TEXT,
        desc TEXT,
        date TEXT
        );
        `)

    //PROFILE
    db.execSync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY NOT NULL, 
            date TEXT,
            height TEXT,
            neck TEXT,
            biceps TEXT,
            weist TEXT,
            weight TEXT
            );
            `)
}

//WORKOUT
export const addWorkout = (title, exercises, desc, date) => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'INSERT INTO workout (title, exercises, desc, date) VALUES ($title, $exercises, $desc, $date);'
        );

        let result = statement.executeSync({ $title: title, $exercises: exercises, $desc: desc, $date: date });
        return result;

    } catch (error) {
        console.error(error)
    }

}

export const updateWorkout = (id, title, exercises, desc, date) => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'UPDATE workout SET title=$title, exercises=$exercises, desc=$desc, date=$date WHERE id=$id;'
        );

        let result = statement.executeSync({ $id: id, $title: title, $exercises: exercises, $desc: desc, $date: date });
        return result;

    } catch (error) {
        console.error(error)
    }

}
export const deleteWorkout = (id) => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'DELETE FROM workout WHERE id=$id;'
        );

        let result = statement.executeSync({ $id: id });
        return result;

    } catch (error) {
        console.error(error)
    }

}

export const getWorkouts = () => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'SELECT * FROM workout'
        );

        let result = statement.executeSync();
        return result;

    } catch (error) {
        console.error(error)
    }

}

export const getExercises = () => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'SELECT exercises FROM workout'
        );

        let result = statement.executeSync();
        return result;

    } catch (error) {
        console.error(error)
    }

}

export const getWorkout = (id) => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'SELECT * FROM workout WHERE id=$id;'
        );

        let result = statement.executeSync({ $id: id });
        return result;

    } catch (error) {
        console.error(error)
    }

}


//PROFILE
export const updateProfile = (date, height, neck, biceps, weist, weight) => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'INSERT INTO profile (date, height, neck, biceps, weist, weight) VALUES ($date, $height, $neck, $biceps, $weist, $weight);'
        );

        let result = statement.executeSync({ $date: date, $height: height, $neck: neck, $biceps: biceps, $weist: weist, $weight: weight });
        return result;

    } catch (error) {
        console.error(error)
    }

}
export const getProfile = () => {
    updateWorkouts()
    try {

        const statement = db.prepareSync(
            'SELECT * FROM profile'
        );

        let result = statement.executeSync();
        return result;

    } catch (error) {
        console.error(error)
    }

}
