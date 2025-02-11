import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
    PORT: number;
    DSN: string;
    MUEBLES_MICROSERVICE_PORT: number;
    MUEBLES_MICROSERVICE_HOST: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DSN: joi.string().required(),
    MUEBLES_MICROSERVICE_PORT: joi.number().required(),
    MUEBLES_MICROSERVICE_HOST: joi.string().required(),
})
.unknown(true);

const {error, value } = envsSchema.validate(process.env);

if(error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    dsn: envVars.DSN,
    mueblesMicroservicePort: envVars.MUEBLES_MICROSERVICE_PORT,
    mueblesMicroserviceHost: envVars.MUEBLES_MICROSERVICE_HOST
}

