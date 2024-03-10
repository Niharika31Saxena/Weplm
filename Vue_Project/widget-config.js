const fs = require("fs");

const cfg = {
    urls: {
        // URL to serve from webpack (local)
        local: "https://localhost:8091/widget"
        // local: "https://lp5-awe4-cem.dsone.3ds.com:8091/widget"

        // URL to access this server (public), default is same as local
        //   you can define different public URL if you serve behind reverse proxy
        //      but public path and local path must be the same (webpack limitation)
        //   in case of S3: public URL must be undef
        // public: "https://public.host:443/widget/"
    },
    webpackDevOptions: {
        // in this section you can override webpack dev options (base configuration from webpack.config.dev.js)
        // please refer to https://webpack.js.org/configuration/ for global webpack configuration
        // please refer to https://webpack.js.org/configuration/dev-server/ for devServer

        devServer: {
            // TODO uncomment these lines if you want to serve https
            https: {
                // key: fs.readFileSync("E:\\users\\EPI\\LocalCertificates\\localhost+3-key.pem"),
                // cert: fs.readFileSync("E:\\users\\EPI\\LocalCertificates\\localhost+3.pem")
                // key: fs.readFileSync("C:\\Asobin\\Works\\Projects\\Ericsson\\Widget\\cert_keys\\r2019x.key"),
                // cert: fs.readFileSync("C:\\Asobin\\Works\\Projects\\Ericsson\\Widget\\cert_keys\\r2019x.crt")
            }
        }
    },
    s3: {
        // This section to configure startS3
        //   if you use startS3, urls.public must be undef and you must enable https
        options: {
            // aws sdk will use default profile if no accessKeyId & secretAccessKey are provided
            // accessKeyId: "your_AWS_AccessKeyId",
            // secretAccessKey: "your_AWS_SecretAccessKey",
            // region: "your_AWS_S3_bucket_region"
        },
        params: {
            Bucket: "btcc",
            ACL: "public-read",
            // distant path ;file path & name will be concatenated to the Key parameter
            Key: "EPI/electrical-data-widget-debug"
        }
    },
    devVariables: {
        vue: {
            useExternalDebugger: false
        }
    }
};

module.exports = cfg;
