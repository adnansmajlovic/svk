import * as cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

// import db from '$lib/db';

export async function prepare(incoming) {
  const cookies = cookie.parse(incoming.headers.cookie || '');

  const headers = {};
  if (!cookies.session_id) {
    headers['set-cookie'] = `session_id=${uuid()}; HttpOnly`;
  }

  return {
    headers,
    context: {
      adnanTest: {
        key1: 'value 1',
      },
      // user: await db.get_user(cookies.session_id),
    },
  };
}

/**
 * @param {{
 *   context: any
 * }} options
 * @returns {any}
 */
export function getSession({ context }) {
  return {
    adnanTest: {
      key1: context.adnanTest?.key1,
    },
    user: {
      // only include properties needed client-side —
      // exclude anything else attached to the user
      // like access tokens etc
      name: context.user?.name,
      email: context.user?.email,
      avatar: context.user?.avatar,
    },
  };
}
