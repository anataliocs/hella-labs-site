// Videos (/videos/): talks and demos from the Hella Labs YouTube channel, newest first

export interface Video {
  // YouTube video id
  id: string;
  title: string;
  description: string;
}

export const youtubeChannelUrl = "https://www.youtube.com/@hella-labs";

export const videos: Video[] = [
  {
    id: "O24v0wPksuk",
    title: "Web3 Chaos Engineering with Anvil Foundry Testcontainers and a WireMock Proxy",
    description:
      "Simulate flaky RPC nodes and network faults in your integration tests by putting a WireMock proxy in front of a Foundry Anvil Testcontainer.",
  },
];
