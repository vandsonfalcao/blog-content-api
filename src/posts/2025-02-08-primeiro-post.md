# Formatando PC com Manjaro GNOME

## Instalação do SO

Baixe o BalenaEtcher e a SO do Manjaro GNOME e faça o Pendrive.
Geralmente ao ligar a máquina tecla F12 serve para escolher a midia para o boot e Delete serve para ir para o setup da bios.
Durante instalação não é nescessario fazer SWAP.

## Custominazão do SO

OhMyZSH - terminal
powerlevel10k - tema do terminal
Sugestão de comandos & Syntax highlighting no terminal

- Clone this repository into $ZSH_CUSTOM/plugins (by default ~/.oh-my-zsh/custom/plugins)

```
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
```

- Add the plugin to the list of plugins for Oh My Zsh to load (inside ~/.zshrc):

```
nano ~/.zshrc
```

```
plugins=( 
    git
    yarn
    npm
    zsh-autosuggestions
    zsh-syntax-highlighting
)
```

- Start a new terminal session.

>Terminal tranparente

```
sudo pacman -Syu gnome-terminal-fedora
```

Firefox Addon
<https://addons.mozilla.org/en-US/firefox/addon/simple-translate/>

Snap Store
Abra o Pamac > Preferencias > Insira as credenciais de administrador > Clique na aba terceiros > Habilite suporte a Snap.
Caso não apareça a opção utilize o link abaixo para habilitar a opção.
<https://manjariando.com.br/pamac-snap-flatpak/>
>Comando para habilitar a opção

```
pamac install libpamac-snap-plugin
```

>Após habilitar suporte rode o comando abaixo, nao lembro a ordem...

```
sudo ln -s /var/lib/snapd/snap /snap
systemctl enable --now snapd.apparmor
```

Discord

```
sudo pacman -Syu discord
or
sudo snap install discord
```

uma vez tive problemas de app desatualizado entao usei o da snapstore

Spotify

```
flatpak install flathub com.spotify.Client
```

Insomnia

```
flatpak install flathub rest.insomnia.Insomnia
or
sudo snap install insomnia
```

Firefox
>se o firefox vier com visual diferente basta desintalar o tema maia

```
sudo pacman -Rc firefox-gnome-theme-maia
```

Telegram

```
sudo pacman -Syu telegram-desktop
```

node-version-manager( nvm )
<https://github.com/nvm-sh/nvm#installing-and-updating>

>Leia a doc pode ter passos após instalar
Depois que instalar o nvm instale o node

```
nvm install --lts
nvm use --lts
node -v
<resposta>
nvm alias default <resposta
```

>Verifique se o yarn & npm foi instalado e caso não use o pacman para instala-los.

```
sudo pacman -Syu yarn npm
```

Evernote
é possivel usar online no site, mas para instalar na maquina é preciso usar o repositorio a seguir.

```
git clone https://aur.archlinux.org/evernote-for-linux-bin.git
cd evertnote-for-linux-bin
makepkg -sir
```

VS code

```
sudo snap install code --classic
```

>Tutorial para concertar as fontes e icones do terminal do vscode
<https://github.com/romkatv/powerlevel10k/issues/671>

>font jetbrains-mono para fonte do editor

```
sudo pacman -Syu ttf-jetbrains-mono
sudo pacman -Syu ttf-meslo-nerd-font-powerlevel10k
```

Docker

```
sudo pacman -S docker docker-compose docker-buildx
sudo usermod -aG docker $USER
sudo systemctl enable docker
reboot
```

Flameshot

```
sudo pacman -Syu flameshot
```

OBS Studio

```
sudo pacman -Syu obs-studio
```

Extensões
>CPU Ram Swap e Rede
<https://extensions.gnome.org/extension/1634/resource-monitor/>

>customização de transparencias
<https://extensions.gnome.org/extension/3193/blur-my-shell/>

>Icones minimizados na topbar

<https://extensions.gnome.org/extension/615/appindicator-support/>

>Dash na dock - percebi que não utilizo mas salvei caso precise
<https://extensions.gnome.org/extension/307/dash-to-dock/>

>Melhora no visual na hora de mostrar as janelas e espaços de trabalho
<https://extensions.gnome.org/extension/4158/gnome-40-ui-improvements/>

>Modificar o tema por um instalado no diretorio do usuario
<https://extensions.gnome.org/extension/19/user-themes/>

Tema
há varias formas de fazer aque vi que funciona é:
<https://www.gnome-look.org/p/1253385> - baixar os temas  sweet-dark e  sweet-dark-v40 e instale.
extrair na pasta ~/USER/.themes
PARA FUNCIONAR HABILITE TANTO NOS AJUSTES(gnome-tweaks-tools) >APARENCIA QUANTO  NA EXTENSÃO USER-THEME PARA FUNCIONAR.

>Pacote de icones
<https://www.gnome-look.org/p/1332404>
Eu utilizo o indigo dark
para instalar extraia e execute o install.sh

Programas na inicialização
Utilize os ajustes (gnome-tweak-tool) > inicialização > firefox + spotify + telegram + discord

Atalhos
Vá nas configurações  > Teclado > Atalhos Personalizados > crie duas
Super + E > nautilus
Super + T > gnome-terminal ou o terminal que desejar
super + direcionais > mover, maximizar as janelas
print > flameshot gui > captura da area
print + alt > flameshot full> captura da tela
super + r > obs --startrecording > gravar tela com obs
