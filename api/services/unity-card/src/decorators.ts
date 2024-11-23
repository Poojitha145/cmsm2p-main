import { MethodDecoratorFactory } from "@loopback/core";


export interface ActionTokenMethodMetadata {
    actionType: string;
    description?: string;
}

/**
 * Method decorator to add metadata to authenticate ActionToken
 * @param metadata 
 * @returns 
 */
export function actionTokenMetadata(metadata: ActionTokenMethodMetadata): MethodDecorator {
    return MethodDecoratorFactory.createDecorator<ActionTokenMethodMetadata>(
        'MethodDecorator.actionTokenDecorator',
        metadata,
    );
}

export interface MethodMetadata {
    contentType: 'json' | 'binary' | 'text',
    [key: string]: any;
}

/**
 * Method decorator to add metadata
 * @param metadata 
 * @returns 
 */
export function methodMetadata(metadata: MethodMetadata): MethodDecorator {
    return MethodDecoratorFactory.createDecorator<MethodMetadata>(
        'MethodDecorator.methodMetadata',
        metadata,
    );
}