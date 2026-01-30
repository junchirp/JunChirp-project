interface WhatWeNeedInterface {
  title: string | null;
  text: string | null;
  buttonText: string | null;
}

interface WithRoute extends WhatWeNeedInterface {
  buttonRoute: string;
  buttonUrl?: never;
  buttonTextChat?: never;
}

interface WithUrl extends WhatWeNeedInterface {
  buttonUrl: string;
  buttonTextChat: string;
  buttonRoute?: never;
}

export type WhatWeNeedType = WithRoute | WithUrl;
