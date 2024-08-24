import boto3
import os
import sys

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

def create_or_update_stack(client, stack_name, template_body, parameters, capabilities=None):
    try:
        # Check if the stack exists
        existing_stacks = client.list_stacks(StackStatusFilter=['CREATE_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE'])
        stack_exists = any(stack['StackName'] == stack_name for stack in existing_stacks['StackSummaries'])

        if stack_exists:
            print(f"Updating {stack_name} stack...")
            response = client.update_stack(
                StackName=stack_name,
                TemplateBody=template_body,
                Parameters=parameters,
                Capabilities=capabilities or []
            )
            stack_id = response['StackId']
            print(f"Stack update initiated: {stack_id}")

            # Wait for the stack to be updated
            waiter = client.get_waiter('stack_update_complete')
            waiter.wait(StackName=stack_name)
            print(f"Update {stack_name} stack completed.")
        else:
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

    except client.exceptions.ClientError as e:
        if "No updates are to be performed" in str(e):
            print(f"No updates needed for {stack_name}.")
        else:
            print(f"Error creating/updating stack {stack_name}: {e}")
    except Exception as e:
        print(f"Unexpected error for stack {stack_name}: {e}")

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
    
    if len(sys.argv) > 1:
        for stack in stacks:
            if stack['name'].split("-").pop(-1) == sys.argv[1]:
                create_or_update_stack(client, stack['name'], stack['template_body'], stack['parameters'], stack.get('capabilities'))
    else:
        for stack in stacks:
            create_or_update_stack(client, stack['name'], stack['template_body'], stack['parameters'], stack.get('capabilities'))
