class ImportFileError extends Error {
    constructor(message) {
        super(`Error during file import: ${message}`);
        this.name = 'ImportFileError';
    }
}

module.exports = ImportFileError;