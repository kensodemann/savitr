import { AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth/auth';

export abstract class FirestoreDataService<T extends { id?: string }> {
  constructor(protected afAuth: AngularFireAuth) {}

  all(): Observable<Array<T>> {
    return this.afAuth.user.pipe(
      flatMap(user =>
        this.getCollection(user)
          .snapshotChanges()
          .pipe(map(this.actionsToData))
      )
    );
  }

  async get(id: string): Promise<T> {
    const user = await this.afAuth.currentUser;
    const doc = await this.getCollection(user)
      .doc<T>(id)
      .ref.get();
    return { id, ...(doc && doc.data()) } as T;
  }

  async add(item: T): Promise<DocumentReference> {
    const user = await this.afAuth.currentUser;
    return this.getCollection(user).add(item);
  }

  async delete(item: T): Promise<void> {
    const user = await this.afAuth.currentUser;
    return this.getCollection(user)
      .doc(item.id)
      .delete();
  }

  async update(item: T): Promise<void> {
    const user = await this.afAuth.currentUser;
    const data = { ...(item as object) } as T;
    delete data.id;
    return this.getCollection(user)
      .doc(item.id)
      .set(data);
  }

  protected actionsToData(actions: Array<DocumentChangeAction<T>>): Array<T> {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...(data as object) } as T;
    });
  }

  protected abstract getCollection(user?: firebase.User): AngularFirestoreCollection<T>;
}
