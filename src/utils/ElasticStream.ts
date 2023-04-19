import elasticsearch from '@elastic/elasticsearch';

interface LogRecord {
    level: number;
    time: Date;
    msg: string;
    [key: string]: any;
}

export class ElasticsearchStream {
    private client: elasticsearch.Client;
    constructor(host: string) {
        this.client = new elasticsearch.Client({
            node: host,
        });
    }

    write(record: LogRecord): void {
        const index = `logstash-${new Date().toISOString().substr(0, 10)}`;

        this.client.index({
            index,
            body: {
                timestamp: record.time.toISOString(),
                level: record.level,
                message: record.msg,
                meta: record,
            }
        }).catch((err) => {
            console.error(err);
        });
    }
}


