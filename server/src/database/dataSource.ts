import config from "../config";
import { DataSource, DataSourceOptions } from "typeorm";


export const dataSource = new DataSource(config().database as DataSourceOptions);
