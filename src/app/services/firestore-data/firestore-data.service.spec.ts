import { inject, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

import { FirestoreDataService } from './firestore-data.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFireAuthMock,
  createDocumentSnapshotMock,
} from '@test/mocks';

interface DataType {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Injectable()
class TestService extends FirestoreDataService<DataType> {
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  getCollection(): AngularFirestoreCollection<DataType> {
    return this.firestore.collection('data-collection');
  }
}

describe('FirestoreDataService', () => {
  let collection;
  let dataService: FirestoreDataService<DataType>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock },
        TestService,
      ],
    });
    const angularFirestore = TestBed.inject(AngularFirestore);
    collection = createAngularFirestoreCollectionMock();
    (angularFirestore.collection as any).mockReturnValue(collection);
  });

  beforeEach(inject([TestService], (service: TestService) => {
    dataService = service;
    const afAuth = TestBed.inject(AngularFireAuth);
    (afAuth as any).currentUser = Promise.resolve({ uid: '123abc' });
    (afAuth as any).user = of({ uid: '123abc' });
    (afAuth.authState as any).next();
  }));

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  describe('observe changes', () => {
    it('grabs a references to the data collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      dataService.observeChanges().subscribe();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('data-collection');
    });

    it('looks for state changes', () => {
      dataService.observeChanges().subscribe();
      expect(collection.stateChanges).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    let document: any;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a references to the document', async () => {
      await dataService.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the value of the document', async () => {
      await dataService.get('199405fkkgi59');
      expect(document.ref.get).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', async () => {
      const snapshot = createDocumentSnapshotMock();
      snapshot.data.mockReturnValue({
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false,
      });
      document.ref.get.mockResolvedValue(snapshot);
      expect(await dataService.get('199405fkkgi59')).toEqual({
        id: '199405fkkgi59',
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false,
      });
    });
  });

  describe('add', () => {
    it('adds the item to the collection', async () => {
      await dataService.add({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true,
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true,
      });
    });
  });

  describe('delete', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', async () => {
      await dataService.delete({
        id: '49950399KT',
        name: 'shiny',
        description: 'Make them extra shiny',
        isActive: true,
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', async () => {
      await dataService.delete({
        id: '49950399KT',
        name: 'shiny',
        description: 'Make them extra shiny',
        isActive: true,
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', async () => {
      await dataService.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('sets the document data', async () => {
      await dataService.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
    });
  });
});
