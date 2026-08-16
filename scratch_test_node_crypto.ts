import crypto from "crypto";

const rawJSONKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCy4LaQWikoK3bV\nUlN9UPXqNtSaZz4X6/4RCOUfgiWAffS5jSEvLc/4RDsBdFmYqeBm0B5P8z7+qwZw\nVLRcwm8WwujvZ5UwdjIv1eIGRpy3Yu3eRN9sdkGT/HFKSIIjYrNjxu6Z2xYLUeu1\nr9VuZLSTPZDzXDdjfYvVMs82xE2+sYUkyaGp5Q1TlPSkYdyJ3wsVQ0rOZrPrvNWR\nlh7MuQURVFWg4vtR6Aw8DRjCADXEYzb2BVF+8OQHM3rPd88VYJyLVBAWRGZXvcCY\nPeTiIq2Hl+tmiRiDJiRGEAUzOLWjzAoCsQhibZmnWZHnw2W1OoCds2iHC9k43lTF\nRoQkZ39HAgMBAAECggEAWChNcWkt/YEmSM4RHaLH/81UDGCzhoClL2oN2fB/YQsy\nkDwQzbqrU3T1C6t2+LlIQgNx3P9J3aMWQkhMt6aPr00SFeMb8M1fwJmNkoA8flkA\nWFnjLwY9HZz9jJmdoajkNll1gFgsThnqrBlje8uf/y0JghbBqYPXZZRr8Vbf5gmt\nPPDHiAd+yWSSKM9xwwVRR7fcATJY8wgvKK48oiQZkHReVLgmP7YdiLtqLbIuDpYV\nUwo2lua/1uH86k2gAvM19fuUctvGsm2iQjZHrN55cLAASpx+UosHj3q4ivAXQE73\nNeIuX+grHevVW4J7DGbpxfFUqwyavYR5hH9fY9oicQKBgQDteNLtrnEAWgFh3wQi\nDbefb1BO8s2HK9P+cfJE5Gmji0A5ZQWmOpgGvnNtVNtMyqlQhlgGCGbb4jhL29+G\nd+ldUYcOWF5ZU2swS+Um345/BrEAaH80eZaQuywjzTTgI2CxOzvajkPF6NXsTP9b\nbCEPVgH3ONSU+XXaWzBk0BCF2QKBgQDA1Y0L5/6zXXbaby69Kw4cTyzCGdybiROp\npUa2AgQaSfX4OcCh/2Gbb09phXE5FbgwWDxUSqiSkOb1P5WiRtdnu9ZjQE1onYlJ\nbwClckcnp3tlEBZ0M7dVALkQeS7MjNJbLIi/Ae5wFzKwaa6ETm0JOLRQm6ZyCO5x\nMl4vmYFaHwKBgGgNRP74LHNm/KwRuBHjyM2HTL0LDptnzN/0tZ8SJmeOoHmFllAb\n5HkwAgup3t1q/31VIESkcc1u9hPnJ64X5J0LGA5lEhI5xwHGf4Xk9t8Z43y2TOaF\nUD/ig5i8VarQVZHSzosZQwD44KNFqa45VtMNcJcOw7bzB3zB8BZ8RIEhAoGAZ8fG\ntDy0aEYJ/D9QMUDlxDicRw5yG0cnzOqFZtko6hkaBvDWCpmOJ4A9hfXqXKWizmn+\ndgMEPHU9x4nj90UXEt4V4K6vunjmdR4HhAM/5kiN8XM6Emnu5hGQiBwgIrg7UhRi\nuCHK+IqTnjwST2SB7C+XY7aRWtgRs9w+snF0G1MCgYANC7roQeeKUwWC2VBxrXPE\n8vMiQI2e6MNIRQ560DqMzjidlwqMBtjgDKMdH9J+Sfs3bOVspdNc9nZ7GYQRtMYI\n1NrWVcXwqEfCgcg3m7Nujru5mAUO0NUqhR8XZyB3SuziUYvV0kelYTe3B0m4t4lr\nY/gG+WWC80L4kOGAdy/LMQ==\n-----END PRIVATE KEY-----\n";

// What if the user pasted it with literal "\n" in Vercel?
const testKey1705 = rawJSONKey.replace(/\n/g, "\\n") + "\n";
console.log("Length of testKey1705:", testKey1705.length);

// What if the user pasted with a trailing space?
const testKeyWithSpace = rawJSONKey.replace(/\n/g, "\\n") + " ";
console.log("Length with space:", testKeyWithSpace.length);

// Let's test parsing
function testParse(key: string) {
  let clean = key.trim();
  clean = clean.replace(/\\n/g, "\n").replace(/\\\\n/g, "\n");
  console.log("After replace \\n, has real newlines count:", clean.split("\n").length);
  try {
    crypto.createPrivateKey(clean);
    console.log("Direct crypto.createPrivateKey SUCCESS!");
  } catch (e: any) {
    console.log("Direct crypto.createPrivateKey FAILED:", e.message);
  }
}

testParse(testKey1705);
testParse(testKeyWithSpace);
