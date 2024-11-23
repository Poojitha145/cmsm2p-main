export class DataSourceConfig {

    private readonly name: string;
    private readonly connector: string;
    private readonly url: string;
    private readonly host: string;
    private readonly port: string;
    private readonly user: string;
    private readonly password: string;
    private readonly database: string;

    constructor(object: any) {
        this.name = object.name;
        this.connector = object.connector;
        this.url = object.url;
        this.host = object.host;
        this.port = object.port;
        this.user = object.user;
        this.password = object.password;
        this.database = object.database;
    }
}