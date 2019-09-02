import { EMPTY, of, Subject } from 'rxjs';

export function createAngularFireAuthMock() {
  return {
    authState: new Subject(),
    user: of(null),
    idToken: of(null),
    idTokenResult: of(null),
    auth: jasmine.createSpyObj('Auth', {
      sendPasswordResetEmail: Promise.resolve(),
      signInWithEmailAndPassword: Promise.resolve(),
      signInWithPopup: Promise.resolve(),
      signOut: Promise.resolve()
    })
  };
}

class TestDocument<T> {
  private lclData: T;

  constructor(public id: string, data: T) {
    this.lclData = data;
  }

  data(): T {
    return this.lclData;
  }
}

export function createAction<T>(id: string, data: T) {
  return {
    payload: {
      doc: new TestDocument(id, data)
    }
  };
}

export function createAngularFirestoreDocumentMock() {
  const mock = jasmine.createSpyObj('AngularFirestoreDocument', {
    set: Promise.resolve(),
    update: Promise.resolve(),
    delete: Promise.resolve(),
    valueChanges: EMPTY,
    snapshotChanges: EMPTY,
    collection: null
  });
  mock.ref = createDocumentReferenceMock();
  return mock;
}

export function createAngularFirestoreCollectionMock() {
  return jasmine.createSpyObj('AngularFirestoreCollection', {
    doc: createAngularFirestoreDocumentMock(),
    add: Promise.resolve(),
    valueChanges: EMPTY,
    snapshotChanges: EMPTY
  });
}

export function createAngularFirestoreMock() {
  return jasmine.createSpyObj('AngularFirestore', {
    collection: createAngularFirestoreCollectionMock(),
    doc: createAngularFirestoreDocumentMock()
  });
}

export function createDocumentReferenceMock() {
  return jasmine.createSpyObj('DocumentReference', {
    get: Promise.resolve()
  });
}

export function createDocumentSnapshotMock() {
  return jasmine.createSpyObj('DocumentSnapshot', {
    data: undefined
  });
}
