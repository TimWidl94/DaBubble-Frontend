import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../services/channel.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss',
})
export class CreateNewChannelComponent {
  openChannelBox: boolean = true;
  openEditUserBox: boolean = false;
  selectUser: boolean = false;

  channelName: string = '';
  channelDescription: string = '';
  createdFrom: string = '';
  inputAllMember: boolean = true;
  inputSpecificUsers: boolean = false;
  btnDisabled: boolean = false;
  ifUserIsFind: boolean = false;
  searchUser: string = '';

  channelExist:boolean = false;

  searchedUser: any[] = [];

  userImages: any[] = [];

  user: User | null = null;
  allUser: User[] = [];
  specificUser: any[] = [];
  selectedUser: any[] = [];

  topPosition: number = 234;

  constructor(
    private channelService: ChannelService,
    private userService: UsersService,
    private cdRef: ChangeDetectorRef
  ) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt alle Benutzer und speichert diese in der `allUser`-Variable.
   */
  ngOnInit() {
    this.userService.allUser$.subscribe((users) => {
      this.allUser = users;
    });
  }

  /**
   * Schließt das Formular zur Kanal-Erstellung.
   */
  closeCreateChannelBox() {
    this.channelService.setcreateChannelScreen(false);
  }

  /**
   * Öffnet und schließt das Benutzerbearbeitungsformular, indem `openChannelBox` und `openEditUserBox` umgeschaltet werden.
   * Überprüft, ob der Button aktiviert oder deaktiviert werden soll.
   */
  goToEditUser() {
    this.openChannelBox = !this.openChannelBox;
    this.openEditUserBox = !this.openEditUserBox;
    this.checkEnableBtn();
  }

  /**
   * Durchsucht die Benutzer nach dem angegebenen Suchbegriff und fügt Benutzer zur `searchedUser`-Liste hinzu,
   * wenn sie mit dem Suchbegriff übereinstimmen und noch nicht ausgewählt wurden.
   * Entfernt Benutzer, die nicht mehr dem Suchbegriff entsprechen.
   */
  searchSpecificUser() {
    let searchInput = this.searchUser.trim().toLowerCase();
    for (let i = 0; i < this.allUser.length; i++) {
      const user = this.allUser[i];
      const isUserSelected = this.selectedUser.some((u) => u.id === user.id);

      if (
        (user.first_name.toLowerCase().includes(searchInput) ||
          user.last_name.toLowerCase().includes(searchInput)) &&
        !isUserSelected
      ) {
        if (!this.searchedUser.some((u) => u.id === user.id)) {
          this.ifUserIsFind = true;
          this.searchedUser.push(user);
          this.loadUserImages();
        }
      } else {
        this.searchedUser = this.searchedUser.filter((u) => u.id !== user.id);
      }
    }
    if (this.searchedUser.length === 0) {
      this.ifUserIsFind = false;
    }
  }

  /**
   * Aktiviert oder deaktiviert die Eingabeoption für spezifische Benutzer und überprüft, ob der Button aktiviert werden soll.
   */
  activateSearchSpecificUser() {
    this.inputAllMember = !this.inputAllMember;
    this.inputSpecificUsers = !this.inputSpecificUsers;
    this.checkEnableBtn();
  }

  /**
   * Setzt die Benutzerbilder für alle Benutzer, indem es die Bilder mit den entsprechenden Benutzern verknüpft.
   */
  setUserImageToUser() {
    for (let i = 0; i < this.allUser.length; i++) {
      const user = this.allUser[i];
      let userid = user.id;
      for (let x = 0; x < this.userImages.length; x++) {
        const userImage = this.userImages[x];
        let userImgId = userImage.user;
        if (userid == userImgId) {
          user.imagepath = userImage.image_path;
          user.image = userImage.image;
        }
      }
    }
    this.cdRef.detectChanges();
  }

  /**
   * Lädt die Benutzerbilder entweder aus dem Cache oder durch einen API-Aufruf, wenn keine Bilder im Cache vorhanden sind.
   */
  loadUserImages() {
    if (this.userService.getUsersImages().length === 0) {
      this.userService.fetchUserImage().subscribe((data) => {
        this.userImages = data;
        this.setUserImageToUser();
      });
    } else {
      this.userImages = this.userService.getUsersImages();
      this.setUserImageToUser();
    }
  }

  /**
   * Fügt einen ausgewählten Benutzer zur Liste der `selectedUser` hinzu und entfernt ihn aus der `searchedUser`-Liste, falls er dort vorhanden ist.
   * Setzt die Suche zurück und überprüft, ob der Button aktiviert werden soll.
   * @param user Der Benutzer, der hinzugefügt werden soll.
   */
  async addSelectedUser(user: any[]) {
    if (!this.selectedUser.includes(user)) {
      await this.selectedUser.push(user);
      this.ifUserIsFind = false;
      this.searchUser = '';
      this.checkEnableBtn();
      let i = this.searchedUser.indexOf(user);
      if (i !== -1) {
        this.searchedUser.splice(i, 1);
        if (this.searchedUser.length == 0) {
          this.ifUserIsFind = false;
        }
      }
    }
  }

  /**
   * Entfernt einen Benutzer aus der Liste der `selectedUser` und überprüft, ob der Button aktiviert werden soll.
   * @param user Der Benutzer, der entfernt werden soll.
   */
  removeSelectedUser(user: any[]) {
    let i = this.selectedUser.indexOf(user);
    if (i !== -1) {
      this.selectedUser.splice(i, 1);
      this.checkEnableBtn();
    }
  }

  /**
   * Überprüft, ob der Button aktiviert oder deaktiviert werden soll, basierend auf der Anzahl der ausgewählten Benutzer
   * oder der Option "Alle Mitglieder".
   */
  checkEnableBtn() {
    if (this.selectedUser.length >= 1) {
      this.btnDisabled = true;
    } else if (this.inputAllMember) {
      this.btnDisabled = true;
    } else {
      this.btnDisabled = false;
    }
  }

  /* --------- Funktionen zum Erstellen eines neuen Kanals --------- */

  /**
   * Erstellt einen neuen Kanal mit den angegebenen Kanal-Daten und aktualisiert die Kanalliste.
   * @param channelData Die Daten des neuen Kanals, einschließlich Name, Beschreibung und Mitglieder.
   */
  createNewChannel(channelData: any): void {
    this.channelService.createChannel(channelData).subscribe(
      (response) => {
        this.channelService.setcreateChannelScreen(false);
        this.channelService.loadAllChannels();
      },
      (error) => {
        this.channelExist = true;
        setTimeout(()=> {
          this.channelExist = false;
        },5000)
      }
    );
  }

  /**
   * Bereitet die Kanal-Daten vor, je nachdem, ob alle Benutzer oder nur die ausgewählten Benutzer Mitglieder des Kanals sein sollen.
   * Ruft `createNewChannel()` auf, um den Kanal zu erstellen.
   */
  getChannelData() {
    let channelMembers = [];
    if (this.inputAllMember) {
      channelMembers = this.allUser.map((user) => user.id);
    } else if (this.selectedUser.length > 0) {
      channelMembers = this.selectedUser.map((user) => user.id);
    }
    let channelData = {
      channelName: this.channelName,
      channelDescription: this.channelDescription,
      channelMembers: channelMembers,
      createdFrom: this.user?.first_name + ' ' + this.user?.last_name,
      privatChannel: false,
    };
    this.createNewChannel(channelData);
  }
}
