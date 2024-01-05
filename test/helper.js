

const Helpers = {
    /**
     * Turns a sequelize model instances into an array without certain fields
     * @param {*} results
     * @param {array} fieldsToDelete
     * @returns array
     */
    resultsToCleanArray(results, fieldsToDelete = ['id', 'createdAt', 'updatedAt']) {
        let resultAsArray = results.map(instance => instance.get());

        resultAsArray.forEach(element => {
            fieldsToDelete.forEach((field) => {
                delete element[field];
            });
        });

        return resultAsArray;
    },

    /**
     * Turns a sequelize model instance into an object without certain fields
     * @param {object} result
     * @param {array} fieldsToDelete
     * @returns array
     */
    resultToCleanObject(result, fieldsToDelete = ['id', 'createdAt', 'updatedAt']) {
        let resultAsObject = result.get();

        fieldsToDelete.forEach((field) => {
            delete resultAsObject[field];
        });

        return resultAsObject;
    }
};

module.exports = Helpers;