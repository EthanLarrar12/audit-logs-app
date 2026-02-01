import { Trino, BasicAuth } from 'trino-client';

// Trino connection configuration

export const getExecuteTrinoQuery = () => {
    const trino = Trino.create({
        server: 'http://localhost:8080',
        catalog: 'trino_history',
        schema: 'history',
        auth: new BasicAuth('admin'), // Trino requires a user
    });

    return async (query: string) => {
        try {
            const iter = await trino.query(query);
            const rows: any[] = [];
            for await (const row of iter) {
                rows.push(row);
            }
            return rows;
        } catch (error) {
            console.error('Error executing Trino query:', error);
            throw error;
        }
    }
};
