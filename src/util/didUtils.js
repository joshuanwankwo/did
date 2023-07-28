import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
import { DIDDataStore } from "@glazed/did-datastore";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { DIDSession } from "@glazed/did-session";


export const userInfo = {
  name: "",
  country: "",
  avatar: "",
  role: "",
};

export let editMode = {
  editMode: false,
};
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

const aliases = {
  schemas: {
    basicProfile:
      "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
  },
  definitions: {
    BasicProfile:
      "kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic",
  },
  tiles: {},
};

const datastore = new DIDDataStore({ ceramic, model: aliases });

export async function authenticateWithEthereum(ethereumProvider) {
  try {
    const accounts = await ethereumProvider.request({
      method: "eth_requestAccounts",
    });

    const authProvider = new EthereumAuthProvider(
      ethereumProvider,
      accounts[0]
    );

    const session = new DIDSession({ authProvider });

    const did = await session.authorize();
    ceramic.did = did;
  } catch (error) {
    console.log(error);
  }
}

export async function auth() {
  if (window.ethereum === null) {
    throw new Error("Please install Metamsk");
  }
  await authenticateWithEthereum(window.ethereum);
}

export async function getProfileFromCeramic() {
  try {
    await auth();

    //use the DIDDatastore to get profile data from Ceramic
    const profile = await datastore.get("BasicProfile");

    userInfo.name = profile?.name;
    userInfo.country = profile?.country;
    userInfo.role = profile?.role;
    userInfo.avatar = profile?.avatar;

    return profile;
  } catch (error) {
    console.error(error);
  }
}

export async function sendDataToCeramic(userInfo) {
  try {
    await getProfileFromCeramic();

    //use the DIDDatastore to merge profile data to Ceramic
    await datastore.merge("BasicProfile", {
      name: userInfo.name,
      country: userInfo.country,
      avatar: userInfo.avatar,
      role: userInfo.role,
    });

    //use the DIDDatastore to get profile data from Ceramic
    const profile = await datastore.get("BasicProfile");
    return profile;
  } catch (error) {
    console.error(error);
  }
}


