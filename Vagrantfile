# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    # Every Vagrant virtual environment requires a box to build off of.
    # Named boxes, like this one, don't need a URL, since the are looked up
    # in the "vagrant cloud" (https://vagrantcloud.com)
    config.vm.box = "ubuntu/trusty64"

    config.vm.network "private_network", ip: "192.168.50.5"

    #config.vm.provision "shell", path: "provision.sh", privileged: false

    config.vm.provision "ansible" do |ansible|
        ansible.verbose = "v"
        ansible.playbook = "ansible/setup.yml"
    end

    config.ssh.forward_agent = true

    config.vm.provider "virtualbox" do |vb, override|
        vb.customize ["modifyvm", :id, "--memory", "1024"]
    end

    #config.vm.synced_folder "./ansible", "/var/lib/jenkins/jobs/manualONE-CI/workspace/CI/ansible"
end
