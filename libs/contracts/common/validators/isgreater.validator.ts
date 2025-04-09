import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsGreaterThan(property: string, validationOptions?: ValidationOptions){
    return function (object: object, propertyName: string){
        registerDecorator({
            name: 'isGreaterThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments){
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return typeof value === 'number' &&
                           typeof relatedValue === 'number' &&
                           value >= relatedValue
                },
                defaultMessage(args: ValidationArguments){
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} debe ser mayor o igual que ${relatedPropertyName}`;
                },
            }
        });
    }
}