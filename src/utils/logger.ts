import RotatingFileStream from 'bunyan-rotating-file-stream';

import { createLogger, levelFromName, DEBUG, LogLevelString } from 'bunyan';
const Elasticsearch = require('bunyan-elasticsearch');

function createBunyanLogger() {
  const logDir = process.env.LOG_PATH || './logs/siwe_microservice.log';
  // tslint:disable-next-line:no-console
  console.log('Bunyan log level is', process.env.LOG_LEVEL || 'debug');
  const bunyanStreams: any = [
    {
      type: 'raw',
      stream: new RotatingFileStream({
        path: logDir,
        period: '30d', // monthly rotation
        totalFiles: 30, // keep 30 back copies
        rotateExisting: true, // Give ourselves a clean file when we start up, based on period
        threshold: '100m', // Rotate log files larger than 100 megabytes
        totalSize: '500m', // Don't keep more than 500 megabytes of archived log files
        gzip: false, // Compress the archive log files to save space
      }),
    },
  ];

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    // Adding logs to console in local machine and running tests
    bunyanStreams.push({
      stream: process.stdout,
    });
  }

  if (process.env.ENABLE_ELASTICSEARCH_LOG === 'true') {
    if (!process.env.ELASTICSEARCH_HOST) {
      logger.error('ELASTICSEARCH_HOST is not defined');
    } else {
      // const auth = process.env.ELATICSEARCH_AUTH as string;
      // const encodedAuth = Buffer.from(auth).toString('base64');
      // const agent = new HttpsAgent({
      //   rejectUnauthorized: false,
      //   auth: encodedAuth
      // });

      const esStream = new Elasticsearch({
        indexPattern: '[logstash-]YYYY.MM.DD',
        type: 'logs',
        host: process.env.ELASTICSEARCH_HOST as string,
        httpAuth: process.env.ELATICSEARCH_AUTH as string,
        ssl: {
          rejectUnauthorized: false
        },
        httpAgent: false
      });
      bunyanStreams.push({
        stream: esStream,
      });
  }
}
  return createLogger({
    name: 'siwe_microservice',
    level: levelFromName[process.env.LOG_LEVEL as LogLevelString] || DEBUG,
    // level :process.env.LOG_LEVEL | 'error',
    streams: bunyanStreams,
  });
}

export const logger = createBunyanLogger();
