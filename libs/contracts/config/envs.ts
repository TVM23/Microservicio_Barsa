import 'dotenv/config';
import Joi, * as joi from 'joi';

interface EnvVars{
    PORT: number;
    DSN: string;
    MONGODB_URI: string;

    MUEBLES_MICROSERVICE_PORT: number;
    MUEBLES_MICROSERVICE_HOST: string;

    USUARIOS_MICROSERVICE_PORT: number;
    USUARIOS_MICROSERVICE_HOST: string;

    PRODUCTO_MICROSERVICE_PORT: number;
    PRODUCTO_MICROSERVICE_HOST: string;

    PAPELETA_MICROSERVICE_PORT: number;
    PAPELETA_MICROSERVICE_HOST: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DSN: joi.string().required(),
    MONGODB_URI: joi.string().required(),

    MUEBLES_MICROSERVICE_PORT: joi.number().required(),
    MUEBLES_MICROSERVICE_HOST: joi.string().required(),

    USUARIOS_MICROSERVICE_PORT: joi.number().required(),
    USUARIOS_MICROSERVICE_HOST: joi.string().required(),

    PRODUCTO_MICROSERVICE_PORT: joi.number().required(),
    PRODUCTO_MICROSERVICE_HOST: joi.string().required(),

    PAPELETA_MICROSERVICE_PORT: joi.number().required(),
    PAPELETA_MICROSERVICE_HOST: joi.string().required(),
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
    mongodb_URI: envVars.MONGODB_URI,

    mueblesMicroservicePort: envVars.MUEBLES_MICROSERVICE_PORT,
    mueblesMicroserviceHost: envVars.MUEBLES_MICROSERVICE_HOST,

    usuariosMicroservicePort: envVars.USUARIOS_MICROSERVICE_PORT,
    usuariosMicroserviceHost: envVars.USUARIOS_MICROSERVICE_HOST,

    productoMicroservicePort: envVars.PRODUCTO_MICROSERVICE_PORT,
    productoMicroserviceHost: envVars.PRODUCTO_MICROSERVICE_HOST,

    papeletaMicroservicePort: envVars.PAPELETA_MICROSERVICE_PORT,
    papeletaMicroserviceHost: envVars.PAPELETA_MICROSERVICE_HOST,
}

