/**
 * .NET 6.0 WebAPI - Clean Architecture
 * Clean Architecture Template for .NET 6.0 WebApi built with Multitenancy Support.
 *
 * OpenAPI spec version: v2
 * Contact: hello@codewithmukesh.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface Filter { 
    logic?: string;
    filters?: Array<Filter>;
    field?: string;
    operator?: string;
    value?: any;
}