import { Card, Typography } from 'antd'
import type { WheelEvent } from 'react'
import type { ShowCastType, ShowCrewType } from '../../entities/show'

type ShowCreditsSectionProps = {
  cast: ShowCastType[]
  crew: ShowCrewType[]
}

export function ShowCreditsSection({ cast, crew }: ShowCreditsSectionProps) {
  const handlePeopleStripWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    event.preventDefault()
    container.scrollBy({
      left: event.deltaY,
      behavior: 'auto',
    })
  }

  return (
    <section className="show-credits-section">
      <div className="show-credits-grid">
        <Card title="Cast" size="small">
          {cast.length > 0 ? (
            <div className="show-people-strip" onWheel={handlePeopleStripWheel}>
              {cast.map((item) => (
                <Card key={`${item.personId}-${item.characterName}`} size="small" className="show-person-card">
                  <img
                    className="show-person-card-image"
                    src={item.personImg ?? 'https://placehold.co/280x360?text=No+Photo'}
                    alt={item.personName}
                  />
                  <div className="show-person-card-content">
                    <Typography.Text strong>{item.personName}</Typography.Text>
                    <Typography.Text type="secondary" style={{ display: 'block' }}>
                      as {item.characterName}
                    </Typography.Text>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Typography.Text type="secondary">No cast data</Typography.Text>
          )}
        </Card>

        <Card title="Crew" size="small">
          {crew.length > 0 ? (
            <div className="show-people-strip" onWheel={handlePeopleStripWheel}>
              {crew.map((item) => (
                <Card key={`${item.personId}-${item.type}`} size="small" className="show-person-card">
                  <img
                    className="show-person-card-image"
                    src={item.personImg ?? 'https://placehold.co/280x360?text=No+Photo'}
                    alt={item.personName}
                  />
                  <div className="show-person-card-content">
                    <Typography.Text strong>{item.personName}</Typography.Text>
                    <Typography.Text type="secondary" style={{ display: 'block' }}>
                      {item.type}
                    </Typography.Text>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Typography.Text type="secondary">No crew data</Typography.Text>
          )}
        </Card>
      </div>
    </section>
  )
}
