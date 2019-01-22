class CreateCredentials < ActiveRecord::Migration[5.2]
  def change
    create_table :credentials do |t|
      t.string :name
      t.string :smtp_server
      t.string :smtp_port
      t.string :username
      t.string :password

      t.belongs_to :user

      t.timestamps
    end
  end
end
