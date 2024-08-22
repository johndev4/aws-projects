import subprocess
import os
import sys

project_name = os.environ.get("PROJECT_NAME")
stage = os.environ.get("STAGE")
base_dir = "/microservices/services"

def run_command(command):
    """Run a shell command and return the output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing command: {command}\n{result.stderr}")
        return None
    return result.stdout

def deploy_service(service_name, layer_dir=''):
    try:
        if service_name is None or service_name == '':
            raise "'service_name' is required."
        
        service_dir = f"{base_dir}/{service_name}"
        if layer_dir is None or layer_dir == '':
            layer_dir = f"{service_dir}/layer/nodejs"

        # Log the process
        print("Building and deploying Coffee service...")

        # Install dependencies for the layer
        print(f"Installing dependencies in {layer_dir}...")
        os.chdir(layer_dir)
        output = run_command("npm i")
        if output:
            print(output)

        # Install service dependencies
        print(f"Installing service dependencies in {service_dir}...")
        os.chdir(service_dir)
        output = run_command("npm i")
        if output:
            print(output)

        # Deploy the service using the Serverless Framework
        print("Deploying the service with Serverless Framework...")
        output = run_command(f"sls deploy -s {stage}")
        if output:
            print(output)

        print("Deployment complete!")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == 'all':
            print("deploy all services")
        else:
            deploy_service(sys.argv[1])
    else:
        print("No service name argurment.")
    
