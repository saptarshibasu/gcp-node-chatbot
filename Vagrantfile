$install=<<SCRIPT
if [ -f "~/vagrant_provision" ]; then
    exit 0
fi
echo "Updating package lists..."
apt-get update -y
apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository -y \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update -y
apt-get install systemd -y
echo "Installing Docker..."
apt-get install docker-ce --force-yes -y
systemctl start docker
systemctl enable docker
SCRIPT

$installnpm=<<SCRIPT
if [ -f "~/vagrant_provision" ]; then
    exit 0
fi
touch ~/vagrant_provision
SCRIPT

$runapp=<<SCRIPT
sudo chmod 666 /var/run/docker.sock
echo "Building Docker image"
sudo docker build -t gcp-node-chatbot:1.0.0 /vagrant
echo "Running Docker image"
sudo docker run -d -p 4000:4000 gcp-node-chatbot:1.0.0
SCRIPT

Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"
	config.vm.network "forwarded_port", guest: 4000, host: 4000
    config.vm.provider "virtualbox" do |v|
        v.name = "gcp-node-chatbot"
        v.memory = 2048
        v.cpus = 2
    end
    config.vm.provision "shell", inline: $install
	config.vm.provision "shell", inline: $installnpm, privileged: false
	config.vm.provision "shell", inline: $runapp, privileged: false, run: 'always', env: {"MYENV" => ENV['MYENV']}
end