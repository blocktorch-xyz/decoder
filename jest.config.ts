require('dotenv').config({path: `.env.test`});


module.exports = {
    "coveragePathIgnorePatterns": [
        "/node_modules/"
    ],
    // make sure that logs will appear only for failed tests
    reporters: [
        './test/resource/reporter.js',
    ]
}
