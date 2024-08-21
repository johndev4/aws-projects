import boto3
import os

def create_stack(client, stack_name, template_body, parameters, capabilities=None):
    try:
        print(f"Creating {stack_name} stack...")
        response = client.create_stack(
            StackName=stack_name,
            TemplateBody=template_body,
            Parameters=parameters,
            Capabilities=capabilities or []
        )
        stack_id = response['StackId']
        print(f"Stack creation initiated: {stack_id}")

        # Wait for the stack to be created
        waiter = client.get_waiter('stack_create_complete')
        waiter.wait(StackName=stack_name)
        print(f"Create {stack_name} stack completed.")
    except Exception as e:
        print(f"Error creating stack {stack_name}: {e}")

if __name__ == "__main__":
    client = boto3.client('cloudformation')

    project_name = os.environ.get('PROJECT_NAME')
    stage = os.environ.get('STAGE')

    stacks = [
        {
            'name': f"{project_name}-{stage}-vpc",
            'template_body': open('cf_templates/vpc.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ]
        },
        {
            'name': f"{project_name}-{stage}-webSg",
            'template_body': open('cf_templates/webSg.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ]
        },
        {
            'name': f"{project_name}-{stage}-microservicesFunctionRole",
            'template_body': open('cf_templates/microservicesFunctionRole.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ],
            'capabilities': ['CAPABILITY_NAMED_IAM']
        },
        {
            'name': f"{project_name}-{stage}-cognitoUserPool",
            'template_body': open('cf_templates/cognitoUserPool.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ]
        },
        {
            'name': f"{project_name}-{stage}-restApiGw",
            'template_body': open('cf_templates/restApiGw.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ]
        },
        {
            'name': f"{project_name}-{stage}-coffeeDdbTable",
            'template_body': open('cf_templates/coffeeDdbTable.yaml').read(),
            'parameters': [
                {'ParameterKey': 'ProjectName', 'ParameterValue': project_name},
                {'ParameterKey': 'Stage', 'ParameterValue': stage}
            ]
        }
    ]

    for stack in stacks:
        create_stack(client, stack['name'], stack['template_body'], stack['parameters'], stack.get('capabilities'))
