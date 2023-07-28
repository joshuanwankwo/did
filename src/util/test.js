import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { ComposeClient } from "@composedb/client";
import { DIDDataStore } from "@glazed/did-datastore";
import { CeramicClient } from "@ceramicnetwork/http-client";

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

const basicProfile = {
  schemas: {
    basicProfile:
      "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
  },
  definitions: {
    basicProfile:
      "kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic",
  },
  tiles: {},
};

export async function getProfileFromCeramic() {
  const sessionStr = localStorage.getItem("didsession");
  let session;

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || (session.hasSession && session.isExpired)) {
    if (window.ethereum === null || window.ethereum === undefined) {
      throw new Error("No injected Ethereum provider found.");
    }
    const ethProvider = window?.ethereum;

    const addresses = await ethProvider.request({
      method: "eth_requestAccounts",
    });
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId
    );

    const session = await DIDSession.authorize(authMethod, {
      resources: ["ceramic://*"],
    });
    localStorage.setItem("didsession", session.serialize());

    // const session = await loadSession(authMethod);
    console.log(session);

    ceramic.did = session.did;
    console.log(ceramic.did);

    const datastore = new DIDDataStore({ ceramic, model: basicProfile });
    const profile = await datastore.get("basicProfile");
    console.log(profile);

    if (session.isExpired) {
      const session = loadSession(authMethod);
    }
  }
}
