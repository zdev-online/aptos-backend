//

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsDomainConstraint implements ValidatorConstraintInterface {
  public validate(candidate: any, args: ValidationArguments) {
    const domain_regexp = /^[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i;
    return typeof candidate == 'string' && domain_regexp.test(candidate);
  }
}

export function IsDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, property_name: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: property_name,
      options: {
        ...validationOptions,
        message: `The ${property_name} must be a domain`,
      },
      constraints: [],
      validator: IsDomainConstraint,
    });
  };
}
