# Expo Rastreamento App

Este é um aplicativo de rastreamento em tempo real desenvolvido com [Expo](https://expo.dev/). Ele utiliza a API do Google Maps para exibir a localização e outros detalhes importantes.

## Pré-requisitos

Antes de iniciar o projeto, você precisa configurar algumas variáveis de ambiente. Estas variáveis são essenciais para o funcionamento do aplicativo.

### Variáveis de Ambiente Necessárias

- `API_URL`: URL da API que o aplicativo vai utilizar para obter dados de rastreamento.
- `GOOGLE_MAPS_API_KEY`: Chave de API para o Google Maps.

### Como Configurar as Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione as seguintes linhas ao arquivo `.env` com os valores apropriados:

    ```plaintext
    API_URL="http://SOME_IP_ADDRESS_HERE"
    GOOGLE_MAPS_API_KEY="SOME_API_KEY_HERE"
    ```

3. Substitua `SOME_IP_ADDRESS_HERE` pela URL da API que você está utilizando.
4. Substitua `SOME_API_KEY_HERE` pela chave da API do Google Maps.

## Instalação

Siga os passos abaixo para configurar e executar o aplicativo localmente.

1. Clone o repositório:

    ```bash
    git clone https://github.com/Track-Trace-TCC/app-motorista.git
    cd app-motorista
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Execute o projeto:

    ```bash
    npx expo start
    ```

4. Utilize o aplicativo Expo Go no seu dispositivo móvel para escanear o QR code e iniciar o aplicativo no seu dispositivo.

## Funcionalidades

- Rastreamento em tempo real.
- Exibição de mapas com a localização atual.
- Suporte a múltiplas rotas e pontos de interesse.

## Tecnologias Utilizadas

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)

## Contribuição

Se você deseja contribuir com este projeto, siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adicione uma nova feature'`).
4. Faça o push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato:

- **Nome**: Vinícius
- **Email**: viniciusataides@gmail.com
- **GitHub**: [github.com/Track-Trace-TCC](https://github.com/Track-Trace-TCC)

---

**Nota**: Certifique-se de substituir os valores de exemplo e os contatos com as informações reais do seu projeto.
