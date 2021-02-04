import { useRef, useState, useEffect } from 'react';

export function useAsyncLocalStatus<T>(fetch: Function) {
    const [status, setStatus] = useState('initial');
    const [payload, setPayload] = useState<T>();
    useEffect(() => {
        const load = async () => {
            try {
                setStatus('loading');

                const res = await fetch();

                setPayload(res);
                setStatus('success');
            } catch (e) {
                setPayload(undefined);
                setStatus('failure');
            }
        };
        load();
    }, [fetch]);

    return { status, payload };
}
