class CreateCredentials < ActiveRecord::Migration[5.2]
  def change
    create_table :credentials do |t|
      t.string :name,      null: false
      t.string :provider,  null: false
      t.string :username,  null: false

      t.belongs_to :user, null: false

      t.timestamps
    end
  end
end
