module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.ts?$': 'ts-jest'
    },
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/app/$1'
    }
}