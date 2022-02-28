import { isValid } from 'date-fns';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsOnlyDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsOnlyDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: 'Please provide only date like 2021-12-31',
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    return (
                        typeof value === 'string' && isValid(new Date(value))
                    );
                },
            },
        });
    };
}
