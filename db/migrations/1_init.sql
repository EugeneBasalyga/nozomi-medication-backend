create TABLE if not EXISTS "User"(
    "id" VARCHAR (36) PRIMARY KEY,
    "email" VARCHAR (250) UNIQUE NOT NULL,
    "password" VARCHAR (250) NOT NULL,
    "createdAt" BIGINT,
    "updatedAt" BIGINT,
    "version" INT
);

create TABLE if not EXISTS "Medication"(
    "id" VARCHAR (36) PRIMARY KEY,
    "userId" VARCHAR (36) NOT NULL,
    "name" VARCHAR (250) NOT NULL,
    "description" TEXT,
    "count" INT NOT NULL,
    "destinationCount" INT NOT NULL,
    "createdAt" BIGINT,
    "updatedAt" BIGINT,
    "version" INT
);

create TABLE if not EXISTS "Session"(
    "id" VARCHAR (36) PRIMARY KEY,
    "userId" VARCHAR (36) NOT NULL,
    "accessToken" VARCHAR (250) NOT NULL,
    "createdAt" BIGINT,
    "updatedAt" BIGINT,
    "version" INT
);
