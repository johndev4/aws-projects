import yaml
import os

if __name__ == "__main__" :
    cwd = os.getcwd()
    offline_serverless_template_path = os.path.join(cwd, 'serverless.offline.yml')
    offline_serverless_path = os.path.join(cwd, 'serverless.yml')

    serverless_yml = {}
    with open(offline_serverless_template_path, 'r') as stream:
        serverless_yml = yaml.safe_load(stream)

    serverless_yml['functions'] = {}

    for d in os.listdir('../services'):
        path = '../services/{}'.format(d)
        if os.path.isdir(path):
            file = os.path.join(path, 'functions.yml')
            if os.path.isfile(file):
                with open(file, 'r') as stream:
                    try:
                        data = yaml.safe_load(stream)
                        if data:
                            functions = data.items()
                            for name, value in functions:
                                fn_name = '{0}-{1}'.format(d, name)
                                handler_path = '../services/{0}/{1}'.format(d, value['handler'])
                                events = value.get('events', None)
                                if events:
                                    for event in events:
                                        if 'http' in event and 'authorizer' in event['http']:
                                            event['http'].pop('authorizer', None)

                                value['handler'] = handler_path
                                serverless_yml['functions'][fn_name] = value
                    except yaml.YAMLError as exc:
                        print(exc)


    with open(offline_serverless_path, 'w+') as stream:
        stream.write(yaml.dump(serverless_yml, default_flow_style=False))
        print('serverless.yml for offline generated')